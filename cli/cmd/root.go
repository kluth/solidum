package cmd

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "solidum",
	Short: "Solidum - Fine-grained reactive framework CLI",
	Long: `Solidum CLI - A code generator and project scaffolding tool for the Solidum framework.

Solidum is a fine-grained reactive JavaScript framework with zero dependencies.
This CLI helps you quickly create new projects, generate components, and manage your Solidum applications.`,
	Version: "0.1.0",
}

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	// Project scaffolding
	rootCmd.AddCommand(newCmd)
	rootCmd.AddCommand(generateCmd)
	rootCmd.AddCommand(addCmd)

	// Development workflow
	rootCmd.AddCommand(devCmd)
	rootCmd.AddCommand(buildCmd)
	rootCmd.AddCommand(testCmd)

	// Code quality
	rootCmd.AddCommand(typecheckCmd)
	rootCmd.AddCommand(lintCmd)
	rootCmd.AddCommand(formatCmd)

	// Maintenance
	rootCmd.AddCommand(cleanCmd)
	rootCmd.AddCommand(publishCmd)
}
