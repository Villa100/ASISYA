using MediatR;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Application.Categories.Queries
{
    /// <summary>
    /// Handler para obtener una categoría por ID.
    /// </summary>
    public class GetCategoryByIdHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
    {
        private readonly ICategoryRepository _repository;

        public GetCategoryByIdHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.CategoryID);

            if (category == null)
                return null;

            return new CategoryDto
            {
                CategoryID = category.CategoryID,
                CategoryName = category.CategoryName,
                Description = category.Description
            };
        }
    }
}