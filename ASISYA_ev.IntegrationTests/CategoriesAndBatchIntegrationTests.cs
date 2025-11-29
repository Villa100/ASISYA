using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;

namespace ASISYA_ev.IntegrationTests;

public class CategoriesAndBatchIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public CategoriesAndBatchIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Create_Categories_And_Batch_Associate_To_Them()
    {
        // 1) Login to get JWT (matches AuthController demo creds)
        var loginPayload = new { username = "admin", password = "admin123" };
        var loginResp = await _client.PostAsJsonAsync("/api/Auth/login", loginPayload);
        loginResp.EnsureSuccessStatusCode();
        var loginJson = await loginResp.Content.ReadFromJsonAsync<JsonElement>();
        var token = loginJson.GetProperty("token").GetString();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 2) Create categories SERVIDORES and CLOUD
        var catServidores = new { CategoryName = "SERVIDORES", Description = "Infraestructura física" };
        var catCloud = new { CategoryName = "CLOUD", Description = "Servicios cloud" };
        var servResp = await _client.PostAsJsonAsync("/api/Category", catServidores);
        servResp.EnsureSuccessStatusCode();
        var cloudResp = await _client.PostAsJsonAsync("/api/Category", catCloud);
        cloudResp.EnsureSuccessStatusCode();
        var servId = (await servResp.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("categoryID").GetInt32();
        var cloudId = (await cloudResp.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("categoryID").GetInt32();

        // 3) Create batch of products associated to these categories (50/50)
        var batchItems = new List<object>();
        for (int i = 0; i < 20; i++)
        {
            batchItems.Add(new {
                ProductName = $"Prod-SRV-{i}",
                SupplierID = 1,
                CategoryID = servId,
                UnitPrice = 10 + i,
                UnitsInStock = 100
            });
        }
        for (int i = 0; i < 20; i++)
        {
            batchItems.Add(new {
                ProductName = $"Prod-CLOUD-{i}",
                SupplierID = 1,
                CategoryID = cloudId,
                UnitPrice = 20 + i,
                UnitsInStock = 200
            });
        }

        var batchPayload = new { Products = batchItems };
        var batchResp = await _client.PostAsJsonAsync("/api/Product", batchPayload);
        batchResp.EnsureSuccessStatusCode();

        // 4) Query and validate associations via filters
        var respSrv = await _client.GetAsync($"/api/Product?pageNumber=1&pageSize=100&filter=SERVIDORES");
        respSrv.EnsureSuccessStatusCode();
        var respCloud = await _client.GetAsync($"/api/Product?pageNumber=1&pageSize=100&filter=CLOUD");
        respCloud.EnsureSuccessStatusCode();

        var jsonSrv = await respSrv.Content.ReadFromJsonAsync<JsonElement>();
        var jsonCloud = await respCloud.Content.ReadFromJsonAsync<JsonElement>();

        // PaginatedList structure: { items: [], totalCount: n, ... }
        int countSrv = jsonSrv.GetProperty("items").GetArrayLength();
        int countCloud = jsonCloud.GetProperty("items").GetArrayLength();

        Assert.True(countSrv >= 20, $"Esperaba al menos 20 productos SERVIDORES, obtuve {countSrv}");
        Assert.True(countCloud >= 20, $"Esperaba al menos 20 productos CLOUD, obtuve {countCloud}");
    }
}
