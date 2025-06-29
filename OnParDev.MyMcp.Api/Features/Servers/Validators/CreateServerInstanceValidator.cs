using FluentValidation;
using OnParDev.MyMcp.Api.Features.Servers.DTOs;

namespace OnParDev.MyMcp.Api.Features.Servers.Validators;

public class CreateServerInstanceValidator : AbstractValidator<CreateServerInstanceDto>
{
    public CreateServerInstanceValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MaximumLength(128)
            .WithMessage("Name must not exceed 128 characters");

        RuleFor(x => x.Description)
            .MaximumLength(512)
            .WithMessage("Description must not exceed 512 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.McpServerTemplateId)
            .NotEmpty()
            .WithMessage("MCP Server Template ID is required");

        RuleFor(x => x.ContainerSpecId)
            .NotEmpty()
            .WithMessage("Container Spec ID is required");
    }
}