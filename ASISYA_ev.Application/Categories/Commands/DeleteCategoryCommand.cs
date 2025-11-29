using MediatR;

namespace ASISYA_ev.Application.Categories.Commands
{
    /// <summary>
    /// Comando para eliminar una categoría.
    /// </summary>
    public class DeleteCategoryCommand : IRequest<Unit>
    {
        public int CategoryID { get; }

        public DeleteCategoryCommand(int categoryId)
        {
            CategoryID = categoryId;
        }
    }
}