package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	devPort    int
	devPackage string
	devAll     bool
)

var devCmd = &cobra.Command{
	Use:   "dev",
	Short: "Start development server",
	Long: `Start the development server with hot module reloading.

In a monorepo, can start dev servers for all packages or specific ones.`,
	RunE: runDev,
}

func init() {
	devCmd.Flags().IntVarP(&devPort, "port", "p", 0, "Port to run dev server on")
	devCmd.Flags().StringVarP(&devPackage, "package", "f", "", "Run dev server for specific package")
	devCmd.Flags().BoolVarP(&devAll, "all", "a", false, "Run dev servers for all packages in parallel")
}

func runDev(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)

	isMonorepo := fileExists("pnpm-workspace.yaml")

	cyan.Println("\n🚀 Starting development server...")

	var devCommand string
	var devArgs []string

	if isMonorepo {
		if devPackage != "" {
			// Dev mode for specific package
			cyan.Printf("\n📦 Starting dev server for: %s\n\n", devPackage)
			devCommand = "pnpm"
			devArgs = []string{"--filter", devPackage, "dev"}
		} else if devAll {
			// Dev mode for all packages in parallel
			cyan.Println("\n⚡ Starting dev servers for all packages...\n")
			devCommand = "pnpm"
			devArgs = []string{"-r", "--parallel", "dev"}
		} else {
			// Use the monorepo dev script
			devCommand = "pnpm"
			devArgs = []string{"run", "dev"}
		}
	} else {
		// Single project dev mode
		devCommand = "pnpm"
		devArgs = []string{"run", "dev"}
	}

	// Add port if specified
	if devPort > 0 {
		devArgs = append(devArgs, "--", "--port", fmt.Sprintf("%d", devPort))
	}

	green.Println("✨ Dev server starting...\n")

	// Execute dev server
	cmdExec := exec.Command(devCommand, devArgs...)
	cmdExec.Stdout = os.Stdout
	cmdExec.Stderr = os.Stderr
	cmdExec.Stdin = os.Stdin

	if err := cmdExec.Run(); err != nil {
		return fmt.Errorf("dev server failed: %w", err)
	}

	return nil
}
