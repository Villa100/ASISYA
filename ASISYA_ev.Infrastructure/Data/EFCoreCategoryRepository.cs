using Microsoft.EntityFrameworkCore;
using ASISYA_ev.Domain.Entidades;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Infrastructure.Data
{
    /// <summary>
    /// Implementación del repositorio de categorías usando EF Core.
    /// </summary>
    public class EFCoreCategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public EFCoreCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories
                .OrderBy(c => c.CategoryName)
                .ToListAsync();
        }

        public async Task<Category> CreateAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync(c => c.CategoryID == id);
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.Categories.AnyAsync(c => c.CategoryName == name);
        }
    }
}