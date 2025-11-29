using MediatR;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Interfaces;
using ASISYA_ev.Domain.Entidades;

namespace ASISYA_ev.Application.Categories.Commands
{
    /// <summary>
    /// Handler para crear una nueva categoría.
    /// </summary>
    public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
    {
        private readonly ICategoryRepository _repository;

        public CreateCategoryHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            // Validar que no exista otra categoría con el mismo nombre (CategoryName es único)
            if (await _repository.ExistsByNameAsync(request.CategoryName))
            {
                throw new InvalidOperationException($"Ya existe una categoría con el nombre '{request.CategoryName}'");
            }

            var category = new Category
            {
                CategoryName = request.CategoryName,
                Description = request.Description
            };

            var created = await _repository.CreateAsync(category);

            return new CategoryDto
            {
                CategoryID = created.CategoryID,
                CategoryName = created.CategoryName,
                Description = created.Description
            };
        }
    }
}