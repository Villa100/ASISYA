using Microsoft.EntityFrameworkCore;
using ASISYA_ev.Domain.Entidades;

namespace ASISYA_ev.Infrastructure.Data
{
    /// <summary>
    /// DbContext principal de la aplicación.
    /// Configura las entidades y sus relaciones.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets (Tablas)
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Shipper> Shippers { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderDetail> OrderDetails { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de OrderDetail (Tabla de unión con clave compuesta)
            modelBuilder.Entity<OrderDetail>()
                .HasKey(od => new { od.OrderID, od.ProductID });

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(od => od.OrderID);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Product)
                .WithMany(p => p.OrderDetails)
                .HasForeignKey(od => od.ProductID);

            // Índice único en CategoryName
            modelBuilder.Entity<Category>()
                .HasIndex(c => c.CategoryName)
                .IsUnique();

            // Relación recursiva Employee (ReportsTo)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Manager)
                .WithMany(e => e.Subordinates)
                .HasForeignKey(e => e.ReportsTo)
                .IsRequired(false);

            // Relación Order -> Shipper
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Shipper)
                .WithMany(s => s.Orders)
                .HasForeignKey(o => o.ShipVia);
        }
    }
}