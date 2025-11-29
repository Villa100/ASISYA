namespace ASISYA_ev.Domain.Entidades
{
    public class OrderDetail
    {
        // PK y FK1
        public int OrderID { get; set; }
        // Propiedad de Navegación a la Orden
        public Order Order { get; set; } = null!;

        // PK y FK2
        public int ProductID { get; set; }
        // Propiedad de Navegación al Producto
        public Product Product { get; set; } = null!;

        public decimal UnitPrice { get; set; }
        public short Quantity { get; set; }
        public float Discount { get; set; } // El tipo de datos suele ser float o decimal

        // NOTA: La clave compuesta (OrderID, ProductID) se configura en OnModelCreating.
    }
}