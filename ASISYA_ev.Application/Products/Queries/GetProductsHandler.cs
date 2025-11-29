using MediatR;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Interfaces; // Necesario para IProductQueryService

namespace ASISYA_ev.Application.Products.Queries
{
    // El Handler procesa el GetProductsQuery y devuelve el resultado paginado.
    public class GetProductsHandler : IRequestHandler<GetProductsQuery, PaginatedList<ProductListDto>>
    {
        // El Puerto (IProductQueryService) es inyectado, no el DbContext.
        private readonly IProductQueryService _queryService; 

        public GetProductsHandler(IProductQueryService queryService)
        {
            _queryService = queryService;
        }

        public async Task<PaginatedList<ProductListDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            // 1. Delegar la tarea de consulta y mapeo al servicio de infraestructura.
            // La capa Application solo se encarga de llamar al Puerto definido en Domain.
            var result = await _queryService.GetPaginatedProductsAsync(
                request.PageNumber,
                request.PageSize,
                request.Filter
            );

            // 2. Devolver el resultado (que ya es el DTO de salida PaginatedList<ProductListDto>)
            return result;
        }
    }
}