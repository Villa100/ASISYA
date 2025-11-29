namespace ASISYA_ev.Domain.DTOs
{
    /// <summary>
    /// DTO para actualizar una categoría existente.
    /// </summary>
    public class CategoryUpdateDto
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}