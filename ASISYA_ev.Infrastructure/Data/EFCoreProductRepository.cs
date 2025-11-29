using ASISYA_ev.Domain.Interfaces;
using ASISYA_ev.Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using EFCore.BulkExtensions;

namespace ASISYA_ev.Infrastructure.Data
{
    /// <summary>
    /// Implementación del repositorio de productos usando EF Core.
    /// Adaptador para operaciones de escritura (Commands).
    /// </summary>
    public class EFCoreProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public EFCoreProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Inserción masiva optimizada para grandes volúmenes de datos (100k+).
        /// Usa EFCore.BulkExtensions para máxima performance con proveedores relacionales.
        /// Fallback a AddRange para proveedores InMemory (tests).
        /// </summary>
        public async Task BulkInsertAsync(List<Product> products)
        {
            // Detectar si estamos usando un proveedor relacional o InMemory
            var isInMemory = _context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory";
            
            if (isInMemory)
            {
                // Fallback para tests con InMemory: usar AddRange
                await _context.Products.AddRangeAsync(products);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Usar BulkInsert para operaciones masivas eficientes en producción
                await _context.BulkInsertAsync(products);
            }
        }

        /// <summary>
        /// Obtiene un producto por su ID.
        /// </summary>
        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.ProductID == id);
        }

        /// <summary>
        /// Actualiza un producto existente.
        /// </summary>
        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Elimina un producto por su ID.
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
