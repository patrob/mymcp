using AutoFixture;
using Shouldly;
using OnParDev.MyMcp.Api.Features.McpServers.Entities;
using OnParDev.MyMcp.Api.Domain.Entities;
using Xunit;

namespace OnParDev.MyMcp.Api.UnitTests.Features.McpServers;

public class GitHubMcpServerTemplateTests
{
    private readonly Fixture _fixture = new();

    [Fact]
    public void CreateGitHubTemplate_ShouldSetCorrectName()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Name.ShouldBe("GitHub MCP Server");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldSetCorrectDescription()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Description.ShouldBe("Access GitHub repositories, issues, pull requests, and manage GitHub workflows through MCP protocol");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldSetCorrectCategory()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Category.ShouldBe("Version Control");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldBeOfficialTemplate()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.IsOfficial.ShouldBeTrue();
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHaveRepositoryCapability()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Capabilities.ShouldContain(c => c.Name == "Repository Access" && c.IsRequired);
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHaveIssueManagementCapability()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Capabilities.ShouldContain(c => c.Name == "Issue Management");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHavePullRequestCapability()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Capabilities.ShouldContain(c => c.Name == "Pull Request Management");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldRequireGitHubTokenConfiguration()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.DefaultConfiguration.ShouldContainKey("GITHUB_TOKEN");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHaveOptionalRepositoryConfiguration()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.DefaultConfiguration.ShouldContainKey("GITHUB_REPOSITORY");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHaveCorrectDocumentationUrl()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.DocumentationUrl.ShouldBe("https://github.com/modelcontextprotocol/servers/tree/main/src/github");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHaveCorrectRepositoryUrl()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.RepositoryUrl.ShouldBe("https://github.com/modelcontextprotocol/servers");
    }

    [Fact]
    public void CreateGitHubTemplate_ShouldHaveCurrentVersion()
    {
        // Arrange & Act
        var template = GitHubMcpServerTemplate.Create();

        // Assert
        template.Version.ShouldBe("1.0.0");
    }
}

public class GitHubMcpServerConfigurationTests
{
    private readonly Fixture _fixture = new();

    [Fact]
    public void ValidateConfiguration_WithValidToken_ShouldReturnTrue()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = "ghp_validtoken123",
            Repository = "owner/repo"
        };

        // Act
        var result = config.IsValid();

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public void ValidateConfiguration_WithEmptyToken_ShouldReturnFalse()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = "",
            Repository = "owner/repo"
        };

        // Act
        var result = config.IsValid();

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void ValidateConfiguration_WithNullToken_ShouldReturnFalse()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = null,
            Repository = "owner/repo"
        };

        // Act
        var result = config.IsValid();

        // Assert
        result.ShouldBeFalse();
    }

    [Fact]
    public void ValidateConfiguration_WithoutRepository_ShouldReturnTrue()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = "ghp_validtoken123",
            Repository = null
        };

        // Act
        var result = config.IsValid();

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public void GetEnvironmentVariables_ShouldIncludeGitHubToken()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = "ghp_testtoken123",
            Repository = "test/repo"
        };

        // Act
        var envVars = config.GetEnvironmentVariables();

        // Assert
        envVars.ShouldContainKey("GITHUB_TOKEN");
        envVars["GITHUB_TOKEN"].ShouldBe("ghp_testtoken123");
    }

    [Fact]
    public void GetEnvironmentVariables_WithRepository_ShouldIncludeRepository()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = "ghp_testtoken123",
            Repository = "test/repo"
        };

        // Act
        var envVars = config.GetEnvironmentVariables();

        // Assert
        envVars.ShouldContainKey("GITHUB_REPOSITORY");
        envVars["GITHUB_REPOSITORY"].ShouldBe("test/repo");
    }

    [Fact]
    public void GetEnvironmentVariables_WithoutRepository_ShouldNotIncludeRepository()
    {
        // Arrange
        var config = new GitHubMcpServerConfiguration
        {
            GitHubToken = "ghp_testtoken123",
            Repository = null
        };

        // Act
        var envVars = config.GetEnvironmentVariables();

        // Assert
        envVars.ShouldNotContainKey("GITHUB_REPOSITORY");
    }
}