using MediatR;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Application.Products.Queries
{
    /// <summary>
    /// Handler para procesar la consulta de detalle de producto.
    /// </summary>
    public class GetProductDetailHandler : IRequestHandler<GetProductDetailQuery, ProductDetailDto?>
    {
        private readonly IProductQueryService _queryService;

        public GetProductDetailHandler(IProductQueryService queryService)
        {
            _queryService = queryService;
        }

        public async Task<ProductDetailDto?> Handle(GetProductDetailQuery request, CancellationToken cancellationToken)
        {
            return await _queryService.GetProductDetailAsync(request.ProductId);
        }
    }
}
