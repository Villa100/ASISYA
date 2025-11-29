namespace ASISYA_ev.Domain.DTOs
{
    public class ProductCreationItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int SupplierID { get; set; }
        public int CategoryID { get; set; }
        public decimal UnitPrice { get; set; }
        public short UnitsInStock { get; set; }
        // ... otros campos
    }
}
