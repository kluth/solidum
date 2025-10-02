package cmd

import (
	"fmt"

	"github.com/fatih/color"
	"github.com/kluth/solidum-cli/internal/generator"
	"github.com/spf13/cobra"
)

var (
	componentPath string
	functional    bool
)

var generateCmd = &cobra.Command{
	Use:     "generate",
	Aliases: []string{"g"},
	Short:   "Generate components, pages, and more",
	Long:    `Generate boilerplate code for components, pages, and other Solidum artifacts.`,
}

var generateComponentCmd = &cobra.Command{
	Use:     "component [name]",
	Aliases: []string{"c"},
	Short:   "Generate a new component",
	Args:    cobra.ExactArgs(1),
	RunE:    runGenerateComponent,
}

var generatePageCmd = &cobra.Command{
	Use:     "page [name]",
	Aliases: []string{"p"},
	Short:   "Generate a new page",
	Args:    cobra.ExactArgs(1),
	RunE:    runGeneratePage,
}

func init() {
	generateCmd.AddCommand(generateComponentCmd)
	generateCmd.AddCommand(generatePageCmd)

	generateComponentCmd.Flags().StringVarP(&componentPath, "path", "p", "src/components", "Output directory")
	generateComponentCmd.Flags().BoolVar(&functional, "functional", true, "Generate functional component")

	generatePageCmd.Flags().StringVarP(&componentPath, "path", "p", "src/pages", "Output directory")
}

func runGenerateComponent(cmd *cobra.Command, args []string) error {
	name := args[0]

	cyan := color.New(color.FgCyan)
	green := color.New(color.FgGreen, color.Bold)

	cyan.Printf("\n🎨 Generating component: %s\n\n", name)

	if err := generator.CreateComponent(name, componentPath, functional); err != nil {
		return fmt.Errorf("failed to generate component: %w", err)
	}

	green.Printf("✅ Component created: %s/%s.ts\n\n", componentPath, name)
	return nil
}

func runGeneratePage(cmd *cobra.Command, args []string) error {
	name := args[0]

	cyan := color.New(color.FgCyan)
	green := color.New(color.FgGreen, color.Bold)

	cyan.Printf("\n📄 Generating page: %s\n\n", name)

	if err := generator.CreatePage(name, componentPath); err != nil {
		return fmt.Errorf("failed to generate page: %w", err)
	}

	green.Printf("✅ Page created: %s/%s.ts\n\n", componentPath, name)
	return nil
}
