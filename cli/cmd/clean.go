package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	cleanAll         bool
	cleanDist        bool
	cleanNodeModules bool
	cleanCache       bool
)

var cleanCmd = &cobra.Command{
	Use:   "clean",
	Short: "Clean build artifacts and dependencies",
	Long: `Remove build artifacts, node_modules, and caches.

Helps resolve dependency issues and free up disk space.`,
	RunE: runClean,
}

func init() {
	cleanCmd.Flags().BoolVarP(&cleanAll, "all", "a", false, "Clean everything (dist, node_modules, cache)")
	cleanCmd.Flags().BoolVarP(&cleanDist, "dist", "d", false, "Clean dist folders only")
	cleanCmd.Flags().BoolVarP(&cleanNodeModules, "modules", "m", false, "Clean node_modules")
	cleanCmd.Flags().BoolVarP(&cleanCache, "cache", "c", false, "Clean package manager cache")
}

func runClean(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)
	yellow := color.New(color.FgYellow)

	isMonorepo := fileExists("pnpm-workspace.yaml")

	// If no flags set, clean dist by default
	if !cleanAll && !cleanDist && !cleanNodeModules && !cleanCache {
		cleanDist = true
	}

	// Clean all includes everything
	if cleanAll {
		cleanDist = true
		cleanNodeModules = true
		cleanCache = true
	}

	cyan.Println("\n🧹 Cleaning project...\n")

	// Clean dist folders
	if cleanDist {
		yellow.Println("→ Removing dist folders...")
		if isMonorepo {
			if err := runCleanCommand("pnpm", "-r", "exec", "rm", "-rf", "dist"); err != nil {
				fmt.Printf("  Warning: %v\n", err)
			}
		} else {
			os.RemoveAll("dist")
		}
		green.Println("  ✓ Dist folders removed")
	}

	// Clean node_modules
	if cleanNodeModules {
		yellow.Println("→ Removing node_modules...")
		if isMonorepo {
			if err := runCleanCommand("pnpm", "-r", "exec", "rm", "-rf", "node_modules"); err != nil {
				fmt.Printf("  Warning: %v\n", err)
			}
		}
		os.RemoveAll("node_modules")
		green.Println("  ✓ node_modules removed")
	}

	// Clean package manager cache
	if cleanCache {
		yellow.Println("→ Cleaning package manager cache...")
		if commandExists("pnpm") {
			if err := runCleanCommand("pnpm", "store", "prune"); err != nil {
				fmt.Printf("  Warning: failed to clean pnpm cache: %v\n", err)
			} else {
				green.Println("  ✓ pnpm cache cleaned")
			}
		}
	}

	green.Println("\n✅ Clean completed!\n")

	if cleanNodeModules {
		fmt.Println("Run 'pnpm install' to reinstall dependencies")
	}

	return nil
}

func runCleanCommand(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
