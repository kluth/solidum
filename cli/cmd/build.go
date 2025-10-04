package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"sync"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	buildWatch    bool
	buildParallel bool
	buildPackage  string
)

var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "Build the project or specific packages",
	Long: `Build the project with optimizations.

Supports parallel builds and watch mode for faster development.`,
	RunE: runBuild,
}

func init() {
	buildCmd.Flags().BoolVarP(&buildWatch, "watch", "w", false, "Watch mode - rebuild on changes")
	buildCmd.Flags().BoolVarP(&buildParallel, "parallel", "p", true, "Build packages in parallel")
	buildCmd.Flags().StringVarP(&buildPackage, "package", "f", "", "Build specific package (e.g., @sldm/core)")
}

func runBuild(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)
	yellow := color.New(color.FgYellow)

	// Check if we're in a monorepo or single project
	isMonorepo := fileExists("pnpm-workspace.yaml")

	if buildWatch {
		yellow.Println("\n👀 Running in watch mode...")
	}

	cyan.Println("\n🔨 Building project...")

	var buildCommand string
	var buildArgs []string

	if isMonorepo {
		if buildPackage != "" {
			// Build specific package
			cyan.Printf("\n📦 Building package: %s\n\n", buildPackage)
			buildCommand = "pnpm"
			buildArgs = []string{"--filter", buildPackage, "build"}
		} else if buildParallel {
			// Build all packages in parallel
			cyan.Println("\n⚡ Building all packages in parallel...\n")
			return buildMonorepoParallel()
		} else {
			// Build sequentially using the script
			buildCommand = "pnpm"
			buildArgs = []string{"run", "build"}
		}
	} else {
		// Single project build
		if buildWatch {
			buildCommand = "pnpm"
			buildArgs = []string{"run", "dev"}
		} else {
			buildCommand = "pnpm"
			buildArgs = []string{"run", "build"}
		}
	}

	if buildWatch && isMonorepo {
		buildArgs = append(buildArgs, "--watch")
	}

	// Execute build
	cmdExec := exec.Command(buildCommand, buildArgs...)
	cmdExec.Stdout = os.Stdout
	cmdExec.Stderr = os.Stderr
	cmdExec.Stdin = os.Stdin

	if err := cmdExec.Run(); err != nil {
		return fmt.Errorf("build failed: %w", err)
	}

	green.Println("\n✅ Build completed successfully!\n")
	return nil
}

// buildMonorepoParallel builds all packages in the monorepo in parallel
func buildMonorepoParallel() error {
	// Define build order for dependencies
	packages := [][]string{
		// Layer 1: No dependencies
		{"@sldm/utils"},
		// Layer 2: Depends on utils
		{"@sldm/testing", "@sldm/core"},
		// Layer 3: Depends on core
		{"@sldm/debug", "@sldm/ui", "@sldm/ui-chalk", "@sldm/router", "@sldm/store", "@sldm/context"},
		// Layer 4: Depends on multiple packages
		{"@sldm/ssr", "@sldm/storage", "@sldm/integrations"},
		// Layer 5: Final packages
		{"@sldm/dev-reports"},
	}

	green := color.New(color.FgGreen)
	red := color.New(color.FgRed, color.Bold)
	cyan := color.New(color.FgCyan)

	// Build each layer in parallel
	for i, layer := range packages {
		cyan.Printf("🔨 Building layer %d/%d...\n", i+1, len(packages))

		var wg sync.WaitGroup
		errors := make(chan error, len(layer))

		for _, pkg := range layer {
			wg.Add(1)
			go func(packageName string) {
				defer wg.Done()

				fmt.Printf("  → Building %s...\n", packageName)

				cmd := exec.Command("pnpm", "--filter", packageName, "build")
				output, err := cmd.CombinedOutput()

				if err != nil {
					errors <- fmt.Errorf("%s failed: %w\n%s", packageName, err, string(output))
					return
				}

				green.Printf("  ✓ %s built successfully\n", packageName)
			}(pkg)
		}

		wg.Wait()
		close(errors)

		// Check for errors
		for err := range errors {
			red.Printf("\n❌ %v\n", err)
			return err
		}

		fmt.Println()
	}

	return nil
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

// Helper to check if a command exists
func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}
