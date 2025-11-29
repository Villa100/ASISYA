using MediatR;

namespace ASISYA_ev.Application.Products.Commands
{
    /// <summary>
    /// Comando para eliminar un producto.
    /// </summary>
    public class DeleteProductCommand : IRequest<Unit>
    {
        public int ProductID { get; }

        public DeleteProductCommand(int productId)
        {
            ProductID = productId;
        }
    }
}