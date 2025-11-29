using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Categories.Commands
{
    /// <summary>
    /// Comando para actualizar una categoría existente.
    /// </summary>
    public class UpdateCategoryCommand : IRequest<Unit>
    {
        public int CategoryID { get; }
        public string CategoryName { get; }
        public string? Description { get; }

        public UpdateCategoryCommand(int categoryId, string categoryName, string? description = null)
        {
            CategoryID = categoryId;
            CategoryName = categoryName;
            Description = description;
        }
    }
}