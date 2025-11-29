using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Products.Queries
{
    /// <summary>
    /// Query para obtener el detalle de un producto por su ID.
    /// </summary>
    public class GetProductDetailQuery : IRequest<ProductDetailDto?>
    {
        public int ProductId { get; }

        public GetProductDetailQuery(int productId)
        {
            ProductId = productId;
        }
    }
}
