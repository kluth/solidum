package cmd

import (
	"fmt"

	"github.com/fatih/color"
	"github.com/kluth/solidum-cli/internal/generator"
	"github.com/spf13/cobra"
)

var addCmd = &cobra.Command{
	Use:   "add [package]",
	Short: "Add a Solidum package to your project",
	Long: `Add a Solidum package to your project and update package.json.

Available packages:
  - router    : @sldm/router (SPA routing)
  - ui        : @sldm/ui (UI components)
  - store     : @sldm/store (State management)
  - context   : @sldm/context (Dependency injection)
  - ssr       : @sldm/ssr (Server-side rendering)
  - testing   : @sldm/testing (Test utilities)`,
	Args: cobra.ExactArgs(1),
	RunE: runAdd,
}

func runAdd(cmd *cobra.Command, args []string) error {
	pkg := args[0]

	cyan := color.New(color.FgCyan)
	green := color.New(color.FgGreen, color.Bold)

	cyan.Printf("\n📦 Adding package: %s\n\n", pkg)

	packageMap := map[string]string{
		"router":  "@sldm/router",
		"ui":      "@sldm/ui",
		"store":   "@sldm/store",
		"context": "@sldm/context",
		"ssr":     "@sldm/ssr",
		"testing": "@sldm/testing",
	}

	packageName, ok := packageMap[pkg]
	if !ok {
		return fmt.Errorf("unknown package: %s\nRun 'solidum add --help' to see available packages", pkg)
	}

	if err := generator.AddPackage(packageName); err != nil {
		return fmt.Errorf("failed to add package: %w", err)
	}

	green.Printf("✅ Added %s\n", packageName)
	fmt.Println("\nRun 'pnpm install' to install the package")
	fmt.Println()

	return nil
}
