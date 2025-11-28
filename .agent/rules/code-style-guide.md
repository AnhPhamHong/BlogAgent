---
trigger: always_on
description: "Code style guidelines for C# backend and TypeScript/React frontend."
---

# Code Style Guide

This document outlines the coding standards and style guidelines for the Gemini 3.0 POC project.

## General

- **Indentation**: Use 4 spaces for both C# and TypeScript/React files. Do not use tabs.
- **Line Endings**: Use CRLF on Windows, LF on Linux/macOS (Git should handle this).
- **Encoding**: UTF-8 without BOM.
- **File Names**:
  - C#: PascalCase (e.g., WorkflowsController.cs, Workflow.cs).
  - TypeScript Components: PascalCase (e.g., App.tsx, Dashboard.tsx).
  - TypeScript Utilities/Hooks: camelCase (e.g., useAuth.ts, api.ts).

## Backend (C# / .NET)

### Architecture

- Follow **Clean Architecture** principles.
- Layers: Domain, Application, Infrastructure, Api.
- Use **MediatR** for CQRS (Commands and Queries).

### Naming Conventions

- **Classes, Methods, Properties, Structs, Enums**: PascalCase.
- **Interfaces**: PascalCase, prefixed with I (e.g., IApplicationDbContext).
- **Local Variables, Parameters**: camelCase.
- **Private Fields**: _camelCase (e.g.,_mediator, _logger).
- **Constants**: PascalCase.

### Formatting

- **Braces**: Use **Allman** style (opening brace on a new line).
  `csharp
  public void Method()
  {
      if (condition)
      {
          // ...
      }
  }
  `
- **Namespaces**: Use **File-scoped namespaces** (C# 10+).
  `csharp
  namespace AgentCore.Domain.Entities;
  `
- **Using Directives**: Place at the top of the file, outside the namespace.

### Coding Practices

- **Var**: Use var when the type is obvious from the right-hand side (e.g., var workflow = new Workflow();). Use explicit types when it's not obvious.
- **Async/Await**: Use sync and wait for I/O-bound operations. Suffix async methods with Async (optional in Controllers if attribute-based).
- **Comments**: Use XML documentation (///) for public APIs and complex logic.
- **Nullability**: Enable nullable reference types (<Nullable>enable</Nullable>).

## Frontend (TypeScript / React)

### Tech Stack

- **Framework**: Vite + React.
- **Language**: TypeScript.
- **Styling**: TailwindCSS.

### Naming Conventions

- **Components**: PascalCase (e.g., Dashboard).
- **Functions, Hooks**: camelCase (e.g., handleSubmit, useWorkflow).
- **Variables**: camelCase.
- **Types/Interfaces**: PascalCase.

### Formatting

- **Indentation**: 4 spaces.
- **Semicolons**: Always use semicolons.
- **Quotes**: Use single quotes ' for strings and imports, unless double quotes are required.
- **JSX**: Use double quotes for attributes (e.g., className="p-4").

### Component Structure

- Use **Functional Components** with hooks.
- Use export default for main page/layout components.
- Place imports in the following order:
  1. External libraries (React, Router, etc.)
  2. Internal components (@/components/...)
  3. Hooks/Utils/Types
  4. Styles

### Styling

- Use **TailwindCSS** utility classes.
- Avoid inline styles (style={{ ... }}) unless dynamic.
- Use className prop.

### Best Practices

- **Types**: Explicitly define types for props and state. Avoid ny.
- **Hooks**: Follow Rules of Hooks (top level only).
- **Path Aliases**: Use @/ to reference the src directory.
