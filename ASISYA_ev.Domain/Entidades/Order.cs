using System.Collections.Generic;

namespace ASISYA_ev.Domain.Entidades
{
    public class Order
    {
        // PK
        public int OrderID { get; set; }
        
        // Relación con Customer
        public string? CustomerID { get; set; }
        public Customer? Customer { get; set; }

        // FK1 (a Employee)
        public int? EmployeeID { get; set; }
        public Employee? Employee { get; set; }

        public DateTime? OrderDate { get; set; }
        public DateTime? RequiredDate { get; set; }
        public DateTime? ShippedDate { get; set; }

        // FK# (a Shipper)
        public int? ShipVia { get; set; }
        public Shipper? Shipper { get; set; }

        public decimal Freight { get; set; }
        public string? ShipName { get; set; }
        public string? ShipAddress { get; set; }
        public string? ShipCity { get; set; }
        public string? ShipRegion { get; set; }
        public string? ShipPostalCode { get; set; }
        public string? ShipCountry { get; set; }

        // Propiedad de Navegación: Detalles de las órdenes (Muchos a Muchos)
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
