namespace ASISYA_ev.Domain.DTOs
{
    /// <summary>
    /// DTO para crear una nueva categoría.
    /// </summary>
    public class CategoryCreateDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}