namespace ASISYA_ev.Application.Products.DTOs
{
    /// <summary>
    /// DTO para representar un producto en listas (vista resumida).
    /// </summary>
    public class ProductListDto
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string SupplierCompanyName { get; set; } = string.Empty;
        public short UnitsInStock { get; set; }
    }
}
