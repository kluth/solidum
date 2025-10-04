package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	lintFix     bool
	lintPackage string
)

var lintCmd = &cobra.Command{
	Use:   "lint",
	Short: "Run ESLint on the project",
	Long: `Run ESLint to check code quality and style.

Supports auto-fixing common issues with --fix flag.`,
	RunE: runLint,
}

func init() {
	lintCmd.Flags().BoolVarP(&lintFix, "fix", "f", false, "Automatically fix problems")
	lintCmd.Flags().StringVarP(&lintPackage, "package", "p", "", "Lint specific package")
}

func runLint(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)
	yellow := color.New(color.FgYellow)

	isMonorepo := fileExists("pnpm-workspace.yaml")

	if lintFix {
		yellow.Println("\n🔧 Auto-fix mode enabled...")
	}

	cyan.Println("\n🔍 Linting code...")

	var lintCommand string
	var lintArgs []string

	if isMonorepo {
		if lintPackage != "" {
			// Lint specific package
			cyan.Printf("\n📦 Linting package: %s\n\n", lintPackage)
			lintCommand = "pnpm"
			lintArgs = []string{"--filter", lintPackage, "lint"}
		} else {
			// Lint all packages
			lintCommand = "pnpm"
			lintArgs = []string{"-r", "lint"}
		}
	} else {
		// Single project lint
		lintCommand = "pnpm"
		lintArgs = []string{"run", "lint"}
	}

	if lintFix {
		lintArgs = append(lintArgs, "--", "--fix")
	}

	// Execute lint
	cmdExec := exec.Command(lintCommand, lintArgs...)
	cmdExec.Stdout = os.Stdout
	cmdExec.Stderr = os.Stderr
	cmdExec.Stdin = os.Stdin

	if err := cmdExec.Run(); err != nil {
		return fmt.Errorf("linting failed: %w", err)
	}

	if lintFix {
		green.Println("\n✅ Linting completed and issues fixed!\n")
	} else {
		green.Println("\n✅ No linting errors found!\n")
	}
	return nil
}
