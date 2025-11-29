using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Categories.Queries
{
    /// <summary>
    /// Query para obtener todas las categorías.
    /// </summary>
    public class GetCategoriesQuery : IRequest<List<CategoryDto>>
    {
    }
}