using ASISYA_ev.Domain.Interfaces;
using ASISYA_ev.Domain.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System.Text.Json;

namespace ASISYA_ev.Infrastructure.Data
{
    public class ProductQueryService : IProductQueryService
    {
        private readonly ApplicationDbContext _context;
        private readonly IDistributedCache _cache;
        private readonly int _listTtlMinutes;
        private readonly int _detailTtlMinutes;

        public ProductQueryService(ApplicationDbContext context, IDistributedCache cache, IConfiguration configuration)
        {
            _context = context;
            _cache = cache;
            var listTtlStr = configuration["CacheSettings:ListTtlMinutes"];
            var detailTtlStr = configuration["CacheSettings:DetailTtlMinutes"];
            _listTtlMinutes = int.TryParse(listTtlStr, out var lttl) ? lttl : 2;
            _detailTtlMinutes = int.TryParse(detailTtlStr, out var dttl) ? dttl : 10;
        }

        public async Task<PaginatedList<ProductListDto>> GetPaginatedProductsAsync(int pageNumber, int pageSize, string? filter)
        {
            // Usar una versión para bust de listados
            string version = "0";
            try
            {
                version = await _cache.GetStringAsync("product:list:version") ?? "0";
            }
            catch { }
            var cacheKey = $"product:list:v{version}:{pageNumber}:{pageSize}:{filter?.Trim().ToLower() ?? ""}";
            try
            {
                var cached = await _cache.GetStringAsync(cacheKey);
                if (!string.IsNullOrEmpty(cached))
                {
                    var cachedResult = JsonSerializer.Deserialize<PaginatedList<ProductListDto>>(cached);
                    if (cachedResult != null)
                    {
                        return cachedResult;
                    }
                }
            }
            catch
            {
                // Ignorar errores de caché (por ejemplo, Redis no disponible)
            }

            // Enfoque simplificado: proyección directa sin navegaciones para InMemory
            var query = _context.Products.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(filter))
            {
                string search = filter.Trim().ToLower();
                query = query.Where(p => p.ProductName.ToLower().Contains(search));
            }

            var count = await query.CountAsync();

            var items = await query
                .OrderBy(p => p.ProductID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductListDto
                {
                    ProductID = p.ProductID,
                    ProductName = p.ProductName,
                    CategoryID = p.CategoryID,
                    UnitPrice = p.UnitPrice,
                    UnitsInStock = p.UnitsInStock,
                    CategoryName = null, // No usar navegación en InMemory
                    SupplierCompanyName = null
                })
                .ToListAsync();

            var result = new PaginatedList<ProductListDto>(items, count, pageNumber, pageSize);

            // TTL corto para listados
            try
            {
                var ttl = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_listTtlMinutes)
                };
                var json = JsonSerializer.Serialize(result);
                await _cache.SetStringAsync(cacheKey, json, ttl);
            }
            catch
            {
                // Ignorar errores de caché (por ejemplo, Redis no disponible)
            }

            return result;
        }

        public async Task<ProductDetailDto?> GetProductDetailAsync(int productId)
        {
            var cacheKey = $"product:detail:{productId}";
            try
            {
                var cached = await _cache.GetStringAsync(cacheKey);
                if (!string.IsNullOrEmpty(cached))
                {
                    return JsonSerializer.Deserialize<ProductDetailDto>(cached);
                }
            }
            catch
            {
                // Ignorar errores de caché
            }

            // En InMemory, la navegación no funciona, así que buscamos la categoría manualmente
            var prod = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductID == productId);
            if (prod == null) return null;

            string categoryName = null;
            string supplierCompanyName = null;
            // Buscar nombre de categoría y proveedor si existen
            var cat = await _context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.CategoryID == prod.CategoryID);
            if (cat != null) categoryName = cat.CategoryName;
            var sup = await _context.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.SupplierID == prod.SupplierID);
            if (sup != null) supplierCompanyName = sup.CompanyName;

            var result = new ProductDetailDto {
                ProductID = prod.ProductID,
                ProductName = prod.ProductName,
                SupplierID = prod.SupplierID,
                SupplierCompanyName = supplierCompanyName ?? string.Empty,
                CategoryID = prod.CategoryID,
                CategoryName = categoryName ?? string.Empty,
                QuantityPerUnit = prod.QuantityPerUnit,
                UnitPrice = prod.UnitPrice,
                UnitsInStock = prod.UnitsInStock,
                UnitsOnOrder = prod.UnitsOnOrder,
                ReorderLevel = prod.ReorderLevel,
                Discontinued = prod.Discontinued
            };

            if (result != null)
            {
                try
                {
                    var ttl = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_detailTtlMinutes)
                    };
                    var json = JsonSerializer.Serialize(result);
                    await _cache.SetStringAsync(cacheKey, json, ttl);
                }
                catch
                {
                    // Ignorar errores de caché
                }
            }

            return result;
        }
    }
}
