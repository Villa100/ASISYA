using MediatR;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Application.Categories.Commands
{
    /// <summary>
    /// Handler para actualizar una categoría existente.
    /// </summary>
    public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand, Unit>
    {
        private readonly ICategoryRepository _repository;

        public UpdateCategoryHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.CategoryID);
            if (category == null)
            {
                throw new KeyNotFoundException($"Categoría con ID {request.CategoryID} no encontrada");
            }

            // Actualizar propiedades
            category.CategoryName = request.CategoryName;
            category.Description = request.Description;

            await _repository.UpdateAsync(category);

            return Unit.Value;
        }
    }
}