package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	formatCheck bool
)

var formatCmd = &cobra.Command{
	Use:   "format",
	Short: "Format code with Prettier",
	Long: `Format code using Prettier.

By default, formats all files. Use --check to only verify formatting.`,
	RunE: runFormat,
}

func init() {
	formatCmd.Flags().BoolVarP(&formatCheck, "check", "c", false, "Check formatting without modifying files")
}

func runFormat(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)

	if formatCheck {
		cyan.Println("\n🔍 Checking code formatting...")
	} else {
		cyan.Println("\n✨ Formatting code...")
	}

	var formatArgs []string
	if formatCheck {
		formatArgs = []string{"run", "format:check"}
	} else {
		formatArgs = []string{"run", "format"}
	}

	// Execute format
	cmdExec := exec.Command("pnpm", formatArgs...)
	cmdExec.Stdout = os.Stdout
	cmdExec.Stderr = os.Stderr
	cmdExec.Stdin = os.Stdin

	if err := cmdExec.Run(); err != nil {
		return fmt.Errorf("formatting failed: %w", err)
	}

	if formatCheck {
		green.Println("\n✅ All files are properly formatted!\n")
	} else {
		green.Println("\n✅ Code formatted successfully!\n")
	}
	return nil
}
