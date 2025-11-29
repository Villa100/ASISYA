using MediatR;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Application.Categories.Queries
{
    /// <summary>
    /// Handler para obtener todas las categorías.
    /// </summary>
    public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
    {
        private readonly ICategoryRepository _repository;

        public GetCategoriesHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _repository.GetAllAsync();

            return categories.Select(c => new CategoryDto
            {
                CategoryID = c.CategoryID,
                CategoryName = c.CategoryName,
                Description = c.Description
            }).ToList();
        }
    }
}