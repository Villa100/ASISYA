using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Products.Queries
{
    /// <summary>
    /// Query para obtener una lista paginada de productos con filtros y búsqueda.
    /// </summary>
    public class GetProductsQuery : IRequest<PaginatedList<ProductListDto>>
    {
        public int PageNumber { get; }
        public int PageSize { get; }
        public string? Filter { get; }
        public string? Search { get; }

        public GetProductsQuery(int pageNumber, int pageSize, string? filter = null, string? search = null)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            Filter = filter;
            Search = search;
        }
    }
}
