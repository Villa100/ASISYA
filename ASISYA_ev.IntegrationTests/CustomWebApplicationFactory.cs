using ASISYA_ev.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Storage;

namespace ASISYA_ev.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private static readonly InMemoryDatabaseRoot _inMemoryRoot = new();
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Señal para que Program.cs use InMemory en vez de Npgsql durante las pruebas
        builder.ConfigureAppConfiguration(cfg =>
        {
            var dict = new Dictionary<string, string?>
            {
                ["UseInMemoryForTests"] = "true",
                ["ForceInMemory"] = "true"
            };
            cfg.AddInMemoryCollection(dict);
        });
        builder.ConfigureServices(services =>
        {
            // Remover TODAS las registraciones de DbContext para evitar conflicto
            var descriptorsToRemove = services
                .Where(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>))
                .ToList();
            foreach (var descriptor in descriptorsToRemove)
            {
                services.Remove(descriptor);
            }

            // Importante: crear un ServiceProvider interno separado para InMemory
            // Esto evita el conflicto "multiple providers registered"
            services.AddDbContext<ApplicationDbContext>((sp, options) =>
            {
                options.UseInMemoryDatabase("TestDb", _inMemoryRoot);
                // Usar un service provider interno independiente
                options.UseInternalServiceProvider(
                    new ServiceCollection()
                        .AddEntityFrameworkInMemoryDatabase()
                        .BuildServiceProvider());
            });

            // Seed seguro usando el mismo InMemoryDatabaseRoot (sin IDs fijos para evitar colisiones)
            using var tempContext = new ApplicationDbContext(
                new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseInMemoryDatabase("TestDb", _inMemoryRoot)
                    .Options);

            // Agregar un Supplier básico para que los productos puedan asociarse
            if (!tempContext.Suppliers.Any())
            {
                tempContext.Suppliers.Add(new ASISYA_ev.Domain.Entidades.Supplier
                {
                    CompanyName = "Test Supplier",
                    ContactName = "Test Contact"
                });
                tempContext.SaveChanges();
            }

            // Agregar categoría y producto de ejemplo solo si no existen por nombre
            if (!tempContext.Categories.Any(c => c.CategoryName == "Bebidas"))
            {
                tempContext.Categories.Add(new ASISYA_ev.Domain.Entidades.Category
                {
                    CategoryName = "Bebidas",
                    Description = "Categoría de bebidas"
                });
                tempContext.SaveChanges();
            }
            
            if (!tempContext.Products.Any(p => p.ProductName == "Chai"))
            {
                // Buscar CategoryID de "Bebidas" si existe
                var bebidas = tempContext.Categories.FirstOrDefault(c => c.CategoryName == "Bebidas");
                var categoryId = bebidas?.CategoryID ?? 0;

                tempContext.Products.Add(new ASISYA_ev.Domain.Entidades.Product
                {
                    ProductName = "Chai",
                    SupplierID = 1,
                    CategoryID = categoryId,
                    QuantityPerUnit = "10 boxes x 20 bags",
                    UnitPrice = 18m,
                    UnitsInStock = 39,
                    UnitsOnOrder = 0,
                    ReorderLevel = 10,
                    Discontinued = false
                });
                tempContext.SaveChanges();
            }
        });
    }
}
