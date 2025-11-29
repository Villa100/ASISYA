namespace ASISYA_ev.Domain.DTOs
{
    public class LoginResultDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}