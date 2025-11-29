using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Products.Commands
{
    /// <summary>
    /// Comando para crear productos en lote (carga masiva).
    /// </summary>
    public class CreateProductsBatchCommand : IRequest<Unit>
    {
        public List<ProductCreationItemDto> Products { get; }

        public CreateProductsBatchCommand(List<ProductCreationItemDto> products)
        {
            Products = products;
        }
    }
}
