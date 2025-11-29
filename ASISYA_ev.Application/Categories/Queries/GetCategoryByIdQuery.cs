using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Categories.Queries
{
    /// <summary>
    /// Query para obtener una categoría por ID.
    /// </summary>
    public class GetCategoryByIdQuery : IRequest<CategoryDto?>
    {
        public int CategoryID { get; }

        public GetCategoryByIdQuery(int categoryId)
        {
            CategoryID = categoryId;
        }
    }
}