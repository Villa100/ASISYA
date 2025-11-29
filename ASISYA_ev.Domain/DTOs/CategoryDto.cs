namespace ASISYA_ev.Domain.DTOs
{
    /// <summary>
    /// DTO para representar una categoría (vista general).
    /// </summary>
    public class CategoryDto
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}