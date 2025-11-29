using MediatR;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Application.Categories.Commands
{
    /// <summary>
    /// Handler para eliminar una categoría.
    /// </summary>
    public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand, Unit>
    {
        private readonly ICategoryRepository _repository;

        public DeleteCategoryHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            if (!await _repository.ExistsAsync(request.CategoryID))
            {
                throw new KeyNotFoundException($"Categoría con ID {request.CategoryID} no encontrada");
            }

            await _repository.DeleteAsync(request.CategoryID);

            return Unit.Value;
        }
    }
}