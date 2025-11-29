using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Products.Commands
{
    /// <summary>
    /// Comando para actualizar un producto existente.
    /// </summary>
    public class UpdateProductCommand : IRequest<Unit>
    {
        public int ProductID { get; }
        public string ProductName { get; }
        public int SupplierID { get; }
        public int CategoryID { get; }
        public string? QuantityPerUnit { get; }
        public decimal UnitPrice { get; }
        public short UnitsInStock { get; }
        public short UnitsOnOrder { get; }
        public short ReorderLevel { get; }
        public bool Discontinued { get; }

        public UpdateProductCommand(
            int productId,
            string productName,
            int supplierId,
            int categoryId,
            string? quantityPerUnit,
            decimal unitPrice,
            short unitsInStock,
            short unitsOnOrder,
            short reorderLevel,
            bool discontinued)
        {
            ProductID = productId;
            ProductName = productName;
            SupplierID = supplierId;
            CategoryID = categoryId;
            QuantityPerUnit = quantityPerUnit;
            UnitPrice = unitPrice;
            UnitsInStock = unitsInStock;
            UnitsOnOrder = unitsOnOrder;
            ReorderLevel = reorderLevel;
            Discontinued = discontinued;
        }
    }
}