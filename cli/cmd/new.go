package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/fatih/color"
	"github.com/kluth/solidum-cli/internal/generator"
	"github.com/spf13/cobra"
)

var (
	projectTemplate string
	withRouter      bool
	withUI          bool
	withSSR         bool
)

var newCmd = &cobra.Command{
	Use:   "new [project-name]",
	Short: "Create a new Solidum project",
	Long:  `Create a new Solidum project with the specified name and configuration.`,
	Args:  cobra.ExactArgs(1),
	RunE:  runNew,
}

func init() {
	newCmd.Flags().StringVarP(&projectTemplate, "template", "t", "basic", "Project template (basic, spa, ssr)")
	newCmd.Flags().BoolVar(&withRouter, "router", false, "Include @sldm/router")
	newCmd.Flags().BoolVar(&withUI, "ui", false, "Include @sldm/ui")
	newCmd.Flags().BoolVar(&withSSR, "ssr", false, "Include @sldm/ssr")
}

func runNew(cmd *cobra.Command, args []string) error {
	projectName := args[0]
	projectPath := filepath.Join(".", projectName)

	// Check if directory already exists
	if _, err := os.Stat(projectPath); err == nil {
		return fmt.Errorf("directory %s already exists", projectName)
	}

	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen, color.Bold)

	cyan.Printf("\n🚀 Creating Solidum project: %s\n\n", projectName)

	// Determine packages based on template and flags
	packages := []string{"@sldm/core"}

	if projectTemplate == "spa" || withRouter {
		packages = append(packages, "@sldm/router")
	}
	if projectTemplate == "ssr" || withSSR {
		packages = append(packages, "@sldm/ssr")
	}
	if withUI {
		packages = append(packages, "@sldm/ui")
	}

	// Create project
	config := generator.ProjectConfig{
		Name:     projectName,
		Path:     projectPath,
		Template: projectTemplate,
		Packages: packages,
		WithUI:   withUI,
	}

	if err := generator.CreateProject(config); err != nil {
		return fmt.Errorf("failed to create project: %w", err)
	}

	green.Println("✅ Project created successfully!")
	fmt.Println("\nNext steps:")
	fmt.Printf("  cd %s\n", projectName)
	fmt.Println("  pnpm install")
	fmt.Println("  pnpm dev")
	fmt.Println()

	return nil
}
