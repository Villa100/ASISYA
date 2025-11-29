namespace ASISYA_ev.Domain.DTOs
{
    // DTOs/ProductBatchCreationDto.cs
    // Contiene la colección de productos
    public class ProductBatchCreationDto
    {
        public List<ProductCreationItemDto> Products { get; set; } = new List<ProductCreationItemDto>();
    }
}
