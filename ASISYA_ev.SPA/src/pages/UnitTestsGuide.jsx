import React from 'react'

export default function UnitTestsGuide() {
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div className="documentation-container" style={{textAlign:'center',marginTop:'4rem'}}>
        <h2 style={{color:'#dc2626'}}>🔒 Información solo visible para usuarios autenticados</h2>
        <p>Por favor, inicia sesión para acceder a la guía de pruebas unitarias.</p>
      </div>
    )
  }

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>🧪 Guía de Pruebas Unitarias</h1>
        <p className="subtitle">Ejecución, convenciones y cobertura para el proyecto ASISYA</p>
      </div>

      <div className="doc-section">
        <h2>🎯 Objetivo</h2>
        <div className="info-card">
          <p>Garantizar la calidad del código mediante pruebas automatizadas que validan la lógica de negocio, reglas de dominio y handlers CQRS.</p>
        </div>
      </div>

      <div className="doc-section">
        <h2>📁 Estructura de Pruebas</h2>
        <div className="functionality-card">
          <ul>
            <li><code>ASISYA_ev.UnitTests/</code>: Pruebas unitarias (handlers, validaciones de dominios).</li>
            <li><code>ASISYA_ev.IntegrationTests/</code>: Pruebas de integración (flujo API + persistencia + autenticación).</li>
            <li><code>CustomWebApplicationFactory.cs</code>: Host de test para la API.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>⚙️ Ejecución Rápida</h2>
        <div className="code-block">
          <h3>PowerShell</h3>
          <pre>{`# Ejecutar todas las pruebas (unitarias + integración)
dotnet test

# Ejecutar solo unitarias
dotnet test .\\ASISYA_ev.UnitTests\\ASISYA_ev.UnitTests.csproj

# Ejecutar solo integración
dotnet test .\\ASISYA_ev.IntegrationTests\\ASISYA_ev.IntegrationTests.csproj`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>🛠️ Cobertura de Código</h2>
        <div className="functionality-card">
          <ul>
            <li>Se puede usar <code>coverlet.collector</code> agregado en los proyectos de prueba.</li>
            <li>Ejemplo de ejecución con cobertura:</li>
          </ul>
          <div className="code-block">
            <h3>PowerShell</h3>
            <pre>{`dotnet test .\\ASISYA_ev.UnitTests\\ASISYA_ev.UnitTests.csproj \
  /p:CollectCoverage=true \
  /p:CoverletOutputFormat=lcov \
  /p:CoverletOutput=../coverage/unit/`}</pre>
          </div>
        </div>
      </div>

      <div className="doc-section">
        <h2>✅ Convenciones</h2>
        <div className="info-card">
          <ul>
            <li>Nombres descriptivos: <code>NombreDelHandlerTests</code> o <code>EscenarioEsperadoTests</code>.</li>
            <li>Métodos de prueba: patrón Arrange / Act / Assert.</li>
            <li>Evitar dependencias externas en unit tests (usar mocks o in-memory).</li>
            <li>En integración: usar `CustomWebApplicationFactory` para instanciar la API.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>🔍 Ejemplo de Prueba Unitaria (Handler)</h2>
        <div className="code-block">
          <h3>C#</h3>
          <pre>{`[Fact]
public async Task CreateCategoryHandler_Should_Create_Category()
{
    // Arrange
    var handler = new CreateCategoryHandler(_repositoryMock.Object);
    var command = new CreateCategoryCommand { Name = "Nueva", Description = "Test" };

    // Act
    var result = await handler.Handle(command, CancellationToken.None);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Nueva", result.Name);
}`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>🌐 Ejemplo de Prueba de Integración (Autenticación + Productos)</h2>
        <div className="code-block">
          <h3>C#</h3>
          <pre>{`[Fact]
public async Task Auth_And_GetProducts_Flow_Should_Work()
{
    // Arrange (login)
    var loginPayload = JsonContent.Create(new { username = "admin", password = "admin123" });
    var loginResponse = await _client.PostAsync("/api/auth/login", loginPayload);
    loginResponse.EnsureSuccessStatusCode();
    var token = await loginResponse.Content.ReadAsStringAsync();

    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.Trim('"'));

    // Act (get products)
    var productsResponse = await _client.GetAsync("/api/products");
    productsResponse.EnsureSuccessStatusCode();

    // Assert
    var json = await productsResponse.Content.ReadAsStringAsync();
    Assert.Contains("name", json);
}`}</pre>
        </div>
      </div>

      <div className="doc-section">
        <h2>📦 Integración en CI</h2>
        <div className="functionality-card">
          <ul>
            <li>Los pipelines en <code>.github/workflows</code> deben incluir el paso <code>dotnet test</code>.</li>
            <li>Opcional: publicar artefacto de cobertura para análisis.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>💡 Recomendaciones</h2>
        <div className="info-card">
          <ul>
            <li>Priorizar pruebas para lógica crítica (categorías, productos, autenticación).</li>
            <li>Incluir casos de error y validaciones de reglas.</li>
            <li>Revisar resultados fallidos en CI antes de mergear.</li>
            <li>Mantener los tests rápidos y deterministas.</li>
          </ul>
        </div>
      </div>

      <div className="doc-section">
        <h2>📚 Recursos</h2>
        <div className="info-card">
          <ul>
            <li><a href="https://learn.microsoft.com/dotnet/core/testing/" target="_blank" rel="noreferrer">Guía oficial de pruebas .NET</a></li>
            <li><a href="https://github.com/coverlet-coverage/coverlet" target="_blank" rel="noreferrer">Coverlet Coverage</a></li>
            <li>Ejecutar la API con datos de prueba usando <code>deploy-test.ps1</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
