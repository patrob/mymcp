---
description: "Architectural Review Board - analyze architecture, propose changes, and document decisions"
allowed_tools: ["Read", "Glob", "Grep", "Task", "Write", "Edit", "MultiEdit", "Bash", "TodoRead", "TodoWrite"]
---

# Architectural Review Board (ARB)

The ARB slash-command provides comprehensive architectural analysis and decision documentation capabilities for the MCP server management application.

## Usage

```
/project:arb analyze [component|system|performance|security]
/project:arb propose [component] [improvement-description]
/project:arb document [decision-title] [context]
```

## Commands

### Analyze Mode
Performs comprehensive architectural analysis:

- **`/project:arb analyze system`** - Full system architecture review
- **`/project:arb analyze component [name]`** - Specific component analysis
- **`/project:arb analyze performance`** - Performance bottleneck identification
- **`/project:arb analyze security`** - Security vulnerability assessment

### Propose Mode
Generates architectural improvement proposals:

- **`/project:arb propose [component] [description]`** - Create improvement proposal
- **`/project:arb propose refactor [target]`** - Refactoring recommendations
- **`/project:arb propose scaling [requirements]`** - Scaling strategy proposals

### Document Mode
Creates Architecture Decision Records (ADRs):

- **`/project:arb document [title] [context]`** - Create new ADR
- **`/project:arb document review`** - Review existing ADRs for updates
- **`/project:arb document supersede [adr-number] [reason]`** - Supersede existing ADR

## Command Processing Logic

When you use this command, I will:

1. **Parse the command arguments** to determine the mode and target
2. **Research the current architecture** using available tools
3. **Apply the appropriate analysis framework** based on the command mode
4. **Generate actionable recommendations** with specific implementation details
5. **Create or update documentation** as needed (ADRs, architectural diagrams)
6. **Validate against project standards** and existing patterns

### System Analysis Process
For `/project:arb analyze system`:

1. **Codebase Discovery**
   - Analyze project structure and dependencies
   - Review existing ADRs and architectural patterns
   - Identify key components and their relationships

2. **Architecture Assessment**
   - Evaluate adherence to Vertical Slice Architecture
   - Assess technology stack alignment (.NET 9, React 18, PostgreSQL)
   - Review API design and data flow patterns

3. **Quality Analysis**
   - Check code quality metrics and patterns
   - Identify technical debt and maintenance issues
   - Assess test coverage and quality practices

4. **Recommendations**
   - Prioritized list of improvements
   - Impact analysis and implementation effort
   - Risk assessment and mitigation strategies

### Component Analysis Process
For `/project:arb analyze component [name]`:

1. **Component Discovery**
   - Locate component files and dependencies
   - Map component responsibilities and interfaces
   - Identify related components and interactions

2. **Design Review**
   - Assess single responsibility principle adherence
   - Review dependency management and coupling
   - Evaluate error handling and resilience patterns

3. **Performance Analysis**
   - Identify potential bottlenecks
   - Review resource usage patterns
   - Assess scalability characteristics

4. **Improvement Opportunities**
   - Refactoring recommendations
   - Performance optimization suggestions
   - Maintainability improvements

### ADR Generation Process
For `/project:arb document [title] [context]`:

1. **Research Phase**
   - Gather context about the decision
   - Identify alternatives and trade-offs
   - Review existing ADRs for consistency

2. **Template Population**
   - Use established ADR template format
   - Include comprehensive context and rationale
   - Document consequences and implementation notes

3. **Validation**
   - Ensure alignment with project standards
   - Verify ADR numbering and file naming
   - Check for completeness and clarity

4. **Integration**
   - Update ADR README with new entry
   - Commit to version control if requested
   - Schedule review dates

## Architecture Analysis Framework

When analyzing the architecture, I will:

1. **Assess Current State**
   - Review existing ADRs and architectural patterns
   - Identify alignment with Vertical Slice Architecture
   - Evaluate technology stack choices (.NET 9, React 18, PostgreSQL)

2. **Identify Issues and Opportunities**
   - Performance bottlenecks
   - Security vulnerabilities
   - Maintainability concerns
   - Scalability limitations
   - Technical debt

3. **Propose Improvements**
   - Specific, actionable recommendations
   - Trade-off analysis
   - Implementation roadmap
   - Risk assessment

4. **Document Decisions**
   - Follow established ADR template
   - Include context and alternatives considered
   - Document consequences and trade-offs
   - Set review dates

## Integration with Existing ADR System

This command integrates seamlessly with the existing ADR system:

- **Template Compliance**: Uses the established ADR template from `/adr/README.md`
- **Numbering System**: Follows the current ADR numbering scheme (001-007)
- **Review Process**: Aligns with monthly ADR review schedule
- **Documentation Standards**: Maintains consistency with existing ADRs

## Project Context

This command is designed specifically for the OnParDev MyMcp project:

- **Technology Stack**: .NET 9, React 18, TypeScript, PostgreSQL, Entity Framework Core
- **Architecture Pattern**: Vertical Slice Architecture
- **Development Patterns**: SPA Proxy, OpenAPI code generation, feature flags
- **Quality Standards**: Comprehensive testing, linting, formatting requirements

## Implementation Notes

- Leverages existing project patterns and conventions
- Respects the established development workflow
- Integrates with git for ADR version control
- Follows the mandatory automated checks requirements
- Maintains the "research → plan → implement" workflow

## Examples

### Full System Analysis
```
/project:arb analyze system
```
Provides comprehensive review of the entire MCP server management architecture.

### Component-Specific Analysis
```
/project:arb analyze component McpServerProvisioningService
```
Deep-dive analysis of a specific service component.

### Document New Decision
```
/project:arb document "Use Redis for Session Management" "Need to improve session handling performance"
```
Creates a new ADR for a Redis implementation decision.

### Propose Improvement
```
/project:arb propose caching "Implement distributed caching for MCP server status"
```
Generates a proposal for adding distributed caching capabilities.

## Architecture Principles

This command operates under these architectural principles:

1. **Maintainability First**: Prioritize long-term maintainability over short-term gains
2. **Explicit Trade-offs**: Always document what we're choosing to prioritize
3. **Evolutionary Architecture**: Support architecture that can evolve over time
4. **Context-Driven Decisions**: Consider the specific project context and constraints
5. **Evidence-Based**: Base recommendations on concrete evidence and metrics

## Quality Assurance

All architectural recommendations and ADRs created by this command will:

- Follow the established code quality standards
- Pass all automated checks (linting, formatting, testing)
- Align with the project's coding conventions
- Include appropriate documentation and comments
- Consider security and performance implications

Use this command whenever you need to:
- Understand the current architecture
- Identify improvement opportunities
- Document architectural decisions
- Ensure alignment with project standards
- Maintain architectural consistency