using System.Collections.Generic;

namespace ASISYA_ev.Domain.Entidades
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
