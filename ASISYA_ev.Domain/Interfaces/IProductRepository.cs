using ASISYA_ev.Domain.Entidades;

namespace ASISYA_ev.Domain.Interfaces
{
    // El Puerto define los contratos de persistencia que el Dominio requiere.
    public interface IProductRepository
    {
        // 1. Método para la Carga Masiva (Bulk Insert)
        // Este método es esencial para cumplir con el requisito de eficiencia de 100,000 productos.
        Task BulkInsertAsync(List<Product> products);
        
        // 2. Otros métodos CRUD/Consulta avanzada
        Task<Product?> GetByIdAsync(int id);
        Task UpdateAsync(Product product);
    Task DeleteAsync(int id);
        // ... (otros métodos CRUD)
    }
}