package generator

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/kluth/solidum-cli/internal/templates"
)

type ProjectConfig struct {
	Name     string
	Path     string
	Template string
	Packages []string
	WithUI   bool
}

// CreateProject creates a new Solidum project
func CreateProject(config ProjectConfig) error {
	// Create project directory
	if err := os.MkdirAll(config.Path, 0755); err != nil {
		return fmt.Errorf("failed to create project directory: %w", err)
	}

	// Create subdirectories
	dirs := []string{"src", "src/components", "public"}
	if config.Template == "spa" || strings.Contains(config.Template, "router") {
		dirs = append(dirs, "src/pages")
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(filepath.Join(config.Path, dir), 0755); err != nil {
			return err
		}
	}

	// Create package.json
	if err := createPackageJSON(config); err != nil {
		return err
	}

	// Create tsconfig.json
	if err := createTSConfig(config.Path); err != nil {
		return err
	}

	// Create index.html
	if err := createIndexHTML(config); err != nil {
		return err
	}

	// Create main entry file
	if err := createMainFile(config); err != nil {
		return err
	}

	// Create example component
	if err := createExampleComponent(config); err != nil {
		return err
	}

	// Create .gitignore
	if err := createGitIgnore(config.Path); err != nil {
		return err
	}

	// Create README
	if err := createReadme(config); err != nil {
		return err
	}

	return nil
}

// CreateComponent generates a new component
func CreateComponent(name, path string, functional bool) error {
	if err := os.MkdirAll(path, 0755); err != nil {
		return err
	}

	filePath := filepath.Join(path, name+".ts")
	content := templates.ComponentTemplate(name)

	return os.WriteFile(filePath, []byte(content), 0644)
}

// CreatePage generates a new page component
func CreatePage(name, path string) error {
	if err := os.MkdirAll(path, 0755); err != nil {
		return err
	}

	filePath := filepath.Join(path, name+".ts")
	content := templates.PageTemplate(name)

	return os.WriteFile(filePath, []byte(content), 0644)
}

// AddPackage adds a Solidum package to package.json
func AddPackage(packageName string) error {
	pkgPath := "package.json"

	// Read package.json
	data, err := os.ReadFile(pkgPath)
	if err != nil {
		return fmt.Errorf("failed to read package.json: %w", err)
	}

	var pkg map[string]interface{}
	if err := json.Unmarshal(data, &pkg); err != nil {
		return fmt.Errorf("failed to parse package.json: %w", err)
	}

	// Add to dependencies
	deps, ok := pkg["dependencies"].(map[string]interface{})
	if !ok {
		deps = make(map[string]interface{})
		pkg["dependencies"] = deps
	}

	deps[packageName] = "^0.1.0"

	// Write back
	output, err := json.MarshalIndent(pkg, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(pkgPath, output, 0644)
}

func createPackageJSON(config ProjectConfig) error {
	pkg := map[string]interface{}{
		"name":    config.Name,
		"version": "0.1.0",
		"type":    "module",
		"scripts": map[string]string{
			"dev":   "vite",
			"build": "tsc && vite build",
		},
		"dependencies": packageDeps(config.Packages),
		"devDependencies": map[string]string{
			"typescript": "^5.3.0",
			"vite":       "^5.0.0",
		},
	}

	output, err := json.MarshalIndent(pkg, "", "  ")
	if err != nil {
		return err
	}

	path := filepath.Join(config.Path, "package.json")
	return os.WriteFile(path, output, 0644)
}

func packageDeps(packages []string) map[string]string {
	deps := make(map[string]string)
	for _, pkg := range packages {
		deps[pkg] = "^0.1.0"
	}
	return deps
}

func createTSConfig(path string) error {
	content := templates.TSConfigTemplate()
	filePath := filepath.Join(path, "tsconfig.json")
	return os.WriteFile(filePath, []byte(content), 0644)
}

func createIndexHTML(config ProjectConfig) error {
	content := templates.IndexHTMLTemplate(config.Name, config.WithUI)
	filePath := filepath.Join(config.Path, "index.html")
	return os.WriteFile(filePath, []byte(content), 0644)
}

func createMainFile(config ProjectConfig) error {
	content := templates.MainTemplate(config.Template, config.WithUI)
	filePath := filepath.Join(config.Path, "src", "main.ts")
	return os.WriteFile(filePath, []byte(content), 0644)
}

func createExampleComponent(config ProjectConfig) error {
	content := templates.AppComponentTemplate(config.WithUI)
	filePath := filepath.Join(config.Path, "src", "components", "App.ts")
	return os.WriteFile(filePath, []byte(content), 0644)
}

func createGitIgnore(path string) error {
	content := templates.GitIgnoreTemplate()
	filePath := filepath.Join(path, ".gitignore")
	return os.WriteFile(filePath, []byte(content), 0644)
}

func createReadme(config ProjectConfig) error {
	content := templates.ReadmeTemplate(config.Name)
	filePath := filepath.Join(config.Path, "README.md")
	return os.WriteFile(filePath, []byte(content), 0644)
}

func runCommand(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
