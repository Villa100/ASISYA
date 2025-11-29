namespace ASISYA_ev.Application.Common.Models
{
    /// <summary>
    /// Representa una lista paginada de elementos con información de paginación.
    /// </summary>
    /// <typeparam name="T">El tipo de elementos en la lista</typeparam>
    public class PaginatedList<T>
    {
        public List<T> Items { get; }
        public int PageNumber { get; }
        public int TotalPages { get; }
        public int TotalCount { get; }
        public int PageSize { get; }

        public PaginatedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            TotalCount = count;
            PageSize = pageSize;
            Items = items;
        }

        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
}
