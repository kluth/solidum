package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	typecheckWatch   bool
	typecheckPackage string
)

var typecheckCmd = &cobra.Command{
	Use:   "typecheck",
	Short: "Run TypeScript type checking",
	Long: `Run TypeScript type checking across the project.

Validates types without emitting files for fast feedback.`,
	RunE: runTypecheck,
}

func init() {
	typecheckCmd.Flags().BoolVarP(&typecheckWatch, "watch", "w", false, "Watch mode - recheck on changes")
	typecheckCmd.Flags().StringVarP(&typecheckPackage, "package", "f", "", "Typecheck specific package")
}

func runTypecheck(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)
	yellow := color.New(color.FgYellow)

	isMonorepo := fileExists("pnpm-workspace.yaml")

	if typecheckWatch {
		yellow.Println("\n👀 Running in watch mode...")
	}

	cyan.Println("\n🔍 Type checking...")

	var checkCommand string
	var checkArgs []string

	if isMonorepo {
		if typecheckPackage != "" {
			// Typecheck specific package
			cyan.Printf("\n📦 Type checking package: %s\n\n", typecheckPackage)
			checkCommand = "pnpm"
			checkArgs = []string{"--filter", typecheckPackage, "typecheck"}
		} else {
			// Typecheck all packages
			checkCommand = "pnpm"
			checkArgs = []string{"-r", "typecheck"}
		}
	} else {
		// Single project typecheck
		checkCommand = "pnpm"
		checkArgs = []string{"run", "typecheck"}
	}

	if typecheckWatch {
		checkArgs = append(checkArgs, "--watch")
	}

	// Execute typecheck
	cmdExec := exec.Command(checkCommand, checkArgs...)
	cmdExec.Stdout = os.Stdout
	cmdExec.Stderr = os.Stderr
	cmdExec.Stdin = os.Stdin

	if err := cmdExec.Run(); err != nil {
		return fmt.Errorf("type checking failed: %w", err)
	}

	green.Println("\n✅ No type errors found!\n")
	return nil
}
