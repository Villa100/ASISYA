using System.Collections.Generic;

namespace ASISYA_ev.Domain.Entidades
{
    public class Product
    {
        // PK
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;

        // FK2 (a Supplier)
        public int SupplierID { get; set; }
        public Supplier Supplier { get; set; } = null!;

        // FK1 (a Category)
        public int CategoryID { get; set; }
        public Category Category { get; set; } = null!;

        public string? QuantityPerUnit { get; set; }
        public decimal UnitPrice { get; set; }
        public short UnitsInStock { get; set; }
        public short UnitsOnOrder { get; set; }
        public short ReorderLevel { get; set; }
        public bool Discontinued { get; set; }
        
        // Propiedad de Navegación: Detalles de las órdenes (Muchos a Muchos)
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
