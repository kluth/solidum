.PHONY: build install clean test

# Binary name
BINARY_NAME=solidum

# Build the CLI
build:
	go build -o $(BINARY_NAME) main.go

# Install globally
install:
	go install

# Build for multiple platforms
build-all:
	GOOS=darwin GOARCH=amd64 go build -o bin/$(BINARY_NAME)-darwin-amd64
	GOOS=darwin GOARCH=arm64 go build -o bin/$(BINARY_NAME)-darwin-arm64
	GOOS=linux GOARCH=amd64 go build -o bin/$(BINARY_NAME)-linux-amd64
	GOOS=windows GOARCH=amd64 go build -o bin/$(BINARY_NAME)-windows-amd64.exe

# Clean build artifacts
clean:
	rm -f $(BINARY_NAME)
	rm -rf bin/

# Run tests
test:
	go test ./...

# Install dependencies
deps:
	go mod download
	go mod tidy

# Format code
fmt:
	go fmt ./...

# Run
run:
	go run main.go
