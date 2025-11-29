namespace ASISYA_ev.Domain.DTOs
{
    /// <summary>
    /// DTO para representar el detalle completo de un producto.
    /// </summary>
    public class ProductDetailDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int SupplierID { get; set; }
        public string SupplierCompanyName { get; set; } = string.Empty;
        public int CategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? QuantityPerUnit { get; set; }
        public decimal UnitPrice { get; set; }
        public short UnitsInStock { get; set; }
        public short UnitsOnOrder { get; set; }
        public short ReorderLevel { get; set; }
        public bool Discontinued { get; set; }
    }
}