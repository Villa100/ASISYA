using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Domain.Interfaces
{
    public interface IProductQueryService
    {
        Task<PaginatedList<ProductListDto>> GetPaginatedProductsAsync(int page, int size, string? filter);
        Task<ProductDetailDto?> GetProductDetailAsync(int productId);
    }
}
