package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	testWatch    bool
	testCoverage bool
	testUI       bool
	testPackage  string
	testCI       bool
	testParallel bool
)

var testCmd = &cobra.Command{
	Use:   "test",
	Short: "Run tests for the project",
	Long: `Run tests with various options including watch mode, coverage, and UI.

Supports parallel test execution for faster testing in monorepos.`,
	RunE: runTest,
}

func init() {
	testCmd.Flags().BoolVarP(&testWatch, "watch", "w", false, "Watch mode - rerun tests on changes")
	testCmd.Flags().BoolVarP(&testCoverage, "coverage", "c", false, "Generate coverage report")
	testCmd.Flags().BoolVarP(&testUI, "ui", "u", false, "Open Vitest UI")
	testCmd.Flags().StringVarP(&testPackage, "package", "f", "", "Test specific package")
	testCmd.Flags().BoolVar(&testCI, "ci", false, "Run in CI mode with verbose output")
	testCmd.Flags().BoolVarP(&testParallel, "parallel", "p", false, "Run tests in parallel (monorepo)")
}

func runTest(cmd *cobra.Command, args []string) error {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)
	yellow := color.New(color.FgYellow)

	isMonorepo := fileExists("pnpm-workspace.yaml")

	if testWatch {
		yellow.Println("\n👀 Running in watch mode...")
	}

	cyan.Println("\n🧪 Running tests...")

	var testCommand string
	var testArgs []string

	if isMonorepo {
		if testPackage != "" {
			// Test specific package
			cyan.Printf("\n📦 Testing package: %s\n\n", testPackage)
			testCommand = "pnpm"
			testArgs = []string{"--filter", testPackage, "test"}
		} else if testParallel {
			// Run tests in parallel across packages
			cyan.Println("\n⚡ Running tests in parallel across all packages...\n")
			testCommand = "pnpm"
			testArgs = []string{"-r", "--parallel", "test"}
		} else if testCI {
			// CI mode - sequential with verbose output
			cyan.Println("\n🤖 Running tests in CI mode...\n")
			testCommand = "pnpm"
			testArgs = []string{"-r", "--workspace-concurrency=1", "test", "--reporter=verbose"}
		} else {
			// Regular sequential test
			testCommand = "pnpm"
			testArgs = []string{"-r", "--workspace-concurrency=1", "test"}
		}
	} else {
		// Single project
		testCommand = "pnpm"
		testArgs = []string{"test"}
	}

	// Add flags
	if testWatch && !testCI {
		testArgs = append(testArgs, "--watch")
	}

	if testCoverage {
		testArgs = append(testArgs, "--coverage")
	}

	if testUI {
		testArgs = append(testArgs, "--ui")
	}

	// Add any additional args from command line
	if len(args) > 0 {
		testArgs = append(testArgs, args...)
	}

	// Execute tests
	cmdExec := exec.Command(testCommand, testArgs...)
	cmdExec.Stdout = os.Stdout
	cmdExec.Stderr = os.Stderr
	cmdExec.Stdin = os.Stdin
	cmdExec.Env = os.Environ()

	if err := cmdExec.Run(); err != nil {
		return fmt.Errorf("tests failed: %w", err)
	}

	green.Println("\n✅ All tests passed!\n")
	return nil
}
