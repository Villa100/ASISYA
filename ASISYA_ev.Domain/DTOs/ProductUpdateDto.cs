namespace ASISYA_ev.Domain.DTOs
{
    /// <summary>
    /// DTO para actualizar un producto existente.
    /// </summary>
    public class ProductUpdateDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int SupplierID { get; set; }
        public int CategoryID { get; set; }
        public string? QuantityPerUnit { get; set; }
        public decimal UnitPrice { get; set; }
        public short UnitsInStock { get; set; }
        public short UnitsOnOrder { get; set; }
        public short ReorderLevel { get; set; }
        public bool Discontinued { get; set; }
    }
}