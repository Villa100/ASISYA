using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Categories.Commands
{
    /// <summary>
    /// Comando para crear una nueva categoría.
    /// </summary>
    public class CreateCategoryCommand : IRequest<CategoryDto>
    {
        public string CategoryName { get; }
        public string? Description { get; }

        public CreateCategoryCommand(string categoryName, string? description = null)
        {
            CategoryName = categoryName;
            Description = description;
        }
    }
}