using ASISYA_ev.Domain.Entidades;

namespace ASISYA_ev.Domain.Interfaces
{
    /// <summary>
    /// Contrato para operaciones CRUD de categorías.
    /// </summary>
    public interface ICategoryRepository
    {
        Task<Category?> GetByIdAsync(int id);
        Task<List<Category>> GetAllAsync();
        Task<Category> CreateAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByNameAsync(string name);
    }
}