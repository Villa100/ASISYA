namespace ASISYA_ev.Domain.DTOs
{
    /// <summary>
    /// DTO para representar un producto en listas (vista resumida).
    /// </summary>
    public class ProductListDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int? CategoryID { get; set; }
        public decimal UnitPrice { get; set; }
        public string? CategoryName { get; set; }
        public string? SupplierCompanyName { get; set; }
        public short UnitsInStock { get; set; }
    }
}