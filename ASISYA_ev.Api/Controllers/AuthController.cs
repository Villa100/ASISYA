using ASISYA_ev.Domain.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ASISYA_ev.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public ActionResult<LoginResultDto> Login([FromBody] LoginDto dto)
        {
            // Demo: validar usuario hardcoded. En producción, validar contra base de datos/Identity.
            if (dto.Username != "admin" || dto.Password != "admin123")
                return Unauthorized();

            var jwtSection = _configuration.GetSection("Jwt");
            var issuer = jwtSection["Issuer"] ?? string.Empty;
            var audience = jwtSection["Audience"] ?? string.Empty;
            var secretKey = jwtSection["SecretKey"] ?? string.Empty;
            var expirationMinutes = int.TryParse(jwtSection["ExpirationMinutes"], out var mins) ? mins : 60;

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, dto.Username),
                new Claim(ClaimTypes.Name, dto.Username),
                new Claim(ClaimTypes.Role, "Admin"),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(expirationMinutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            return Ok(new LoginResultDto { Token = tokenString, ExpiresAt = expires });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var name = User.Identity?.Name ?? "";
            var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToArray();
            return Ok(new { user = name, roles });
        }
    }
}