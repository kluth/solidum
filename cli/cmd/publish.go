package cmd

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	publishDryRun bool
	publishTag    string
	publishAccess string
	publishForce  bool
)

var publishCmd = &cobra.Command{
	Use:   "publish",
	Short: "Publish packages to npm",
	Long: `Build, test, and publish packages to npm registry.

For monorepos, publishes all packages in the workspace.
Includes safety checks and version validation.`,
	RunE: runPublish,
}

func init() {
	publishCmd.Flags().BoolVar(&publishDryRun, "dry-run", false, "Simulate publish without actually publishing")
	publishCmd.Flags().StringVarP(&publishTag, "tag", "t", "latest", "npm dist-tag (latest, next, beta, etc.)")
	publishCmd.Flags().StringVar(&publishAccess, "access", "public", "Package access (public or restricted)")
	publishCmd.Flags().BoolVarP(&publishForce, "force", "f", false, "Skip confirmation prompts")
}

func runPublish(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)
	yellow := color.New(color.FgYellow, color.Bold)
	red := color.New(color.FgRed, color.Bold)

	isMonorepo := fileExists("pnpm-workspace.yaml")

	if publishDryRun {
		yellow.Println("\n🔍 Running in dry-run mode - no packages will be published\n")
	}

	cyan.Println("\n📦 Preparing to publish packages...\n")

	// Safety check: ensure git is clean
	if !publishForce && !publishDryRun {
		if !isGitClean() {
			red.Println("❌ Git working directory is not clean!")
			fmt.Println("Please commit or stash your changes before publishing.")
			fmt.Println("Use --force to skip this check.")
			return fmt.Errorf("git working directory not clean")
		}
		green.Println("✓ Git working directory is clean")
	}

	// Step 1: Build
	cyan.Println("\n🔨 Step 1/4: Building packages...")
	if err := runCommandInteractive("pnpm", "run", "build"); err != nil {
		return fmt.Errorf("build failed: %w", err)
	}
	green.Println("✓ Build completed")

	// Step 2: Test
	cyan.Println("\n🧪 Step 2/4: Running tests...")
	if err := runCommandInteractive("pnpm", "test"); err != nil {
		return fmt.Errorf("tests failed: %w", err)
	}
	green.Println("✓ All tests passed")

	// Step 3: Prepare publish (if script exists)
	cyan.Println("\n📝 Step 3/4: Preparing packages...")
	if scriptExists("publish:prepare") {
		if err := runCommandInteractive("pnpm", "run", "publish:prepare"); err != nil {
			yellow.Printf("⚠️  publish:prepare script failed (continuing anyway): %v\n", err)
		} else {
			green.Println("✓ Packages prepared")
		}
	} else {
		yellow.Println("ℹ️  No publish:prepare script found (skipping)")
	}

	// Step 4: Publish
	if !publishForce && !publishDryRun {
		fmt.Println()
		yellow.Println("⚠️  You are about to publish packages to npm!")
		fmt.Print("Continue? (y/N): ")

		reader := bufio.NewReader(os.Stdin)
		response, _ := reader.ReadString('\n')
		response = strings.TrimSpace(strings.ToLower(response))

		if response != "y" && response != "yes" {
			fmt.Println("\nPublish cancelled.")
			return nil
		}
	}

	cyan.Println("\n📤 Step 4/4: Publishing packages...")

	var publishArgs []string
	if isMonorepo {
		publishArgs = []string{"-r", "--filter", "./packages/*", "publish"}
	} else {
		publishArgs = []string{"publish"}
	}

	publishArgs = append(publishArgs, "--access", publishAccess)
	publishArgs = append(publishArgs, "--tag", publishTag)
	publishArgs = append(publishArgs, "--no-git-checks")

	if publishDryRun {
		publishArgs = append(publishArgs, "--dry-run")
	}

	if err := runCommandInteractive("pnpm", publishArgs...); err != nil {
		return fmt.Errorf("publish failed: %w", err)
	}

	if publishDryRun {
		green.Println("\n✅ Dry-run completed successfully!")
	} else {
		green.Println("\n✅ Packages published successfully!")
		fmt.Println("\n🎉 Your packages are now available on npm!")
	}

	return nil
}

func isGitClean() bool {
	cmd := exec.Command("git", "status", "--porcelain")
	output, err := cmd.Output()
	if err != nil {
		return false
	}
	return len(strings.TrimSpace(string(output))) == 0
}

func scriptExists(scriptName string) bool {
	cmd := exec.Command("pnpm", "run", scriptName, "--if-present", "--dry-run")
	err := cmd.Run()
	return err == nil
}

func runCommandInteractive(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}
