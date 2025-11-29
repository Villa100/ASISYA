using System.Collections.Generic;

namespace ASISYA_ev.Domain.Entidades
{
    public class Supplier
    {
        // PK
        public int SupplierID { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? HomePage { get; set; }

        // Propiedad de Navegación: Productos que ofrece este proveedor (Uno a Muchos)
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}