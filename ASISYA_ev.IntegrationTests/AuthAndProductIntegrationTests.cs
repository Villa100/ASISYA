using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using ASISYA_ev.Domain.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using ASISYA_ev.Api;
using Xunit;

namespace ASISYA_ev.IntegrationTests
{
    public class AuthAndProductIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public AuthAndProductIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Login_Returns_Token_Then_Authorized_Post_Product()
        {
            var client = _factory.CreateClient();

            var login = new LoginDto { Username = "admin", Password = "admin123" };
            var body = new StringContent(JsonSerializer.Serialize(login), Encoding.UTF8, "application/json");
            var resp = await client.PostAsync("/api/Auth/login", body);
            resp.EnsureSuccessStatusCode();
            var json = await resp.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<LoginResultDto>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            Assert.NotNull(result);
            Assert.False(string.IsNullOrWhiteSpace(result!.Token));

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);
            // Product POST requiere DTO ProductBatchCreationDto; para esta validación de autorización podemos enviar un JSON mínimo válido
            var productsPayload = new { products = new object[] { } };
            var postResp = await client.PostAsync("/api/Product", new StringContent(JsonSerializer.Serialize(productsPayload), Encoding.UTF8, "application/json"));

            // Debe permitir acceso con token (depende de implementación del body en POST /api/Product)
            Assert.True(postResp.StatusCode != System.Net.HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task Post_Product_Without_Token_Is_Unauthorized()
        {
            var client = _factory.CreateClient();
            var productsPayload = new { products = new object[] { } };
            var postResp = await client.PostAsync("/api/Product", new StringContent(JsonSerializer.Serialize(productsPayload), Encoding.UTF8, "application/json"));
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, postResp.StatusCode);
        }
    }
}