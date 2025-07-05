# Agents Collaboration

These guidelines mirror **CLAUDE.md** so multiple agents can work consistently.

We're building production-quality code together. Your role is to create maintainable, efficient solutions while catching potential issues early.

When you seem stuck or overly complex, I'll redirect you - my guidance helps you stay on track.

## Project Overview

This is a full-stack TypeScript + .NET 9 application for managing MCP (Model Context Protocol) server instances with:

- **Backend**: ASP.NET Core 9, PostgreSQL, EF Core, Vertical Slice Architecture
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk (optional, feature-flagged)
- **Development**: SPA Proxy pattern, OpenAPI code generation

## 🚨 AUTOMATED CHECKS ARE MANDATORY

**ALL hook issues are BLOCKING - EVERYTHING must be ✅ GREEN!**  
No errors. No formatting issues. No linting problems. Zero tolerance.  
These are not suggestions. Fix ALL issues before continuing.

## CRITICAL WORKFLOW - ALWAYS FOLLOW THIS!

### Research → Plan → Implement

**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:

1. **Research**: Explore the codebase, understand existing patterns
2. **Plan**: Create a detailed implementation plan and verify it with me
3. **Implement**: Execute the plan with validation checkpoints

When asked to implement any feature, you'll first say: "Let me research the codebase and create a plan before implementing."

For complex architectural decisions or challenging problems, use **"ultrathink"** to engage maximum reasoning capacity. Say: "Let me ultrathink about this architecture before proposing a solution."

### USE MULTIPLE AGENTS!

_Leverage subagents aggressively_ for better results:

- Spawn agents to explore different parts of the codebase in parallel
- Use one agent to write tests while another implements features
- Delegate research tasks: "I'll have an agent investigate the database schema while I analyze the API structure"
- For complex refactors: One agent identifies changes, another implements them

Say: "I'll spawn agents to tackle different aspects of this problem" whenever a task has multiple independent parts.

### Reality Checkpoints

**Stop and validate** at these moments:

- After implementing a complete feature
- Before starting a new major component
- When something feels wrong
- Before declaring "done"
- **WHEN HOOKS FAIL WITH ERRORS** ❌

Run: `make fmt && make test && make lint`

> Why: You can lose track of what's actually working. These checkpoints prevent cascading failures.

### 🚨 CRITICAL: Hook Failures Are BLOCKING

**When hooks report ANY issues (exit code 2), you MUST:**

1. **STOP IMMEDIATELY** - Do not continue with other tasks
2. **FIX ALL ISSUES** - Address every ❌ issue until everything is ✅ GREEN
3. **VERIFY THE FIX** - Re-run the failed command to confirm it's fixed
4. **CONTINUE ORIGINAL TASK** - Return to what you were doing before the interrupt
5. **NEVER IGNORE** - There are NO warnings, only requirements

This includes:

- Formatting issues (`dotnet format`, prettier, etc.)
- Linting violations (.NET analyzers, eslint, etc.)
- Forbidden patterns (`Thread.Sleep`, excessive `console.log`, `any` types)
- ALL other checks

Your code must be 100% clean. No exceptions.

**Recovery Protocol:**

- When interrupted by a hook failure, maintain awareness of your original task
- After fixing all issues and verifying the fix, continue where you left off
- Use the todo list to track both the fix and your original task

## Working Memory Management

### When context gets long:

- Re-read this CLAUDE.md file
- Summarize progress in a PROGRESS.md file
- Document current state before major changes

### Maintain TODO.md:

```
## Current Task
- [ ] What we're doing RIGHT NOW

## Completed
- [x] What's actually done and tested

## Next Steps
- [ ] What comes next
```

## TypeScript & .NET Best Practices

### FORBIDDEN - NEVER DO THESE:

- **NO `any` or `object`** types – use explicit generics or interfaces
- **NO busy waits** like `setTimeout` polling – rely on `async/await` or event-driven code
- **NO** keeping old and new code together
- **NO** migration functions or compatibility layers
- **NO** versioned method names (`ProcessV2`, `HandleNew`)
- **NO** custom error hierarchies beyond standard exception types
- **NO** TODO comments in final code

> **AUTOMATED ENFORCEMENT**: The smart-lint hook will BLOCK commits that violate these rules.
> When you see `❌ FORBIDDEN PATTERN`, you MUST fix it immediately!

### Required Standards:

- **Delete** old code when replacing it
- **Meaningful names**: `userId` not `id`
- **Early returns** to reduce nesting
- **Dependency injection** for services and configuration
- **Async/await everywhere**: return `Task` in C# and `Promise` in TypeScript
- **Table-driven tests** (xUnit theories or Jest table tests) for complex logic

## Implementation Standards

### Our code is complete when:

- ? All linters pass with zero issues
- ? All tests pass
- ? Feature works end-to-end
- ? Old code is deleted
- ? Godoc on all exported symbols

### Testing Strategy

- Complex business logic ? Write tests first
- Simple CRUD ? Write tests after
- Hot paths ? Add benchmarks
- Skip tests for main() and simple CLI parsing

### Project Structure

```
OnParDev.MyMcp.Api/                 # ASP.NET Core API
OnParDev.MyMcp.Api.UnitTests/       # Unit tests
OnParDev.MyMcp.Api.IntegrationTests/ # Integration tests
OnParDev.MyMcp.Api/ClientApp/       # React frontend
```

## Problem-Solving Together

When you're stuck or confused:

1. **Stop** - Don't spiral into complex solutions
2. **Delegate** - Consider spawning agents for parallel investigation
3. **Ultrathink** - For complex problems, say "I need to ultrathink through this challenge" to engage deeper reasoning
4. **Step back** - Re-read the requirements
5. **Simplify** - The simple solution is usually correct
6. **Ask** - "I see two approaches: [A] vs [B]. Which do you prefer?"

My insights on better approaches are valued - please ask for them!

## Performance & Security

### **Measure First**:

- No premature optimization
- Benchmark before claiming something is faster
- Use BenchmarkDotNet or Node performance tools for real bottlenecks

### **Security Always**:

- Validate all inputs
- Use `RandomNumberGenerator` in .NET or Node's `crypto` module for randomness
- Prepared statements for SQL (never concatenate!)

## Communication Protocol

### Progress Updates:

```
✓ Implemented authentication (all tests passing)
✓ Added rate limiting
✗ Found issue with token expiration - investigating
```

### Suggesting Improvements:

"The current approach works, but I notice [observation].
Would you like me to [specific improvement]?"

## Working Together

- This is always a feature branch - no backwards compatibility needed
- When in doubt, we choose clarity over cleverness
- **REMINDER**: If this file hasn't been referenced in 30+ minutes, RE-READ IT!

Avoid complex abstractions or "clever" code. The simple, obvious solution is probably better, and my guidance helps you stay focused on what matters.

## Architecture Decision Records (ADRs)

Document all architecturally significant decisions using Architecture Decision Records. An ADR captures a single architectural decision and its rationale, helping future developers understand why choices were made.

### ADR Structure

Each ADR should include:

- **Problem statement with context** - What decision needs to be made and why
- **Options considered** - Alternative approaches evaluated
- **Decision outcome** - The chosen solution
- **Important tradeoffs** - What was gained/lost with this decision
- **Confidence level** - How certain we are about this decision

### ADR Process

- **Start early** - Begin ADRs at project onset
- **Maintain throughout** - Keep updating as the project evolves
- **Append-only log** - Never delete or modify existing ADRs
- **Store openly** - Keep ADRs with project documentation for easy access
- **Stay focused** - Keep records pithy, assertive, and factual

### When to Create ADRs

Create ADRs for decisions that:

- Have significant impact on system architecture
- Affect multiple components or teams
- Involve important technology choices
- Include significant tradeoffs
- May need to be revisited later

### ADR Template

Use a consistent template for all ADRs. Break complex decisions into multiple ADRs if needed (short-term, mid-term, long-term approaches).

Reference: [Microsoft Learn ADR Guide](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record) and [ADR Templates](https://adr.github.io/)

