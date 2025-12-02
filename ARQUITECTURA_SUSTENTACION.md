# 🎯 Sustentación de Arquitectura - ASISYA

## Presentación Técnica del Sistema

---

## 📐 Arquitectura en 4 Capas: Fundamentos y Justificación

El sistema ASISYA implementa una **Arquitectura Hexagonal (Ports & Adapters)** con separación en 4 capas bien definidas, siguiendo los principios de **Clean Architecture**, **Domain-Driven Design (DDD)** y **CQRS (Command Query Responsibility Segregation)**. Esta decisión arquitectónica garantiza **mantenibilidad, escalabilidad y testeabilidad** del código.

---

## 🏗️ Visión General de las Capas

```
┌──────────────────────────────────────────────────────┐
│                  CAPA 1: API                          │
│              (Presentación / Delivery)                │
│  ┌─────────────────────────────────────────────┐     │
│  │ • Controllers HTTP (REST)                    │     │
│  │ • Middleware (Auth, CORS, Logging)           │     │
│  │ • Configuración Swagger/OpenAPI              │     │
│  │ • Validación de entrada (DTOs)               │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────────┘
                   │ Comunica vía MediatR
                   ▼
┌──────────────────────────────────────────────────────┐
│            CAPA 2: APPLICATION                        │
│         (Casos de Uso / Lógica de Aplicación)        │
│  ┌─────────────────────────────────────────────┐     │
│  │ • Commands (Create, Update, Delete)          │     │
│  │ • Queries (Get, List, Search)                │     │
│  │ • Handlers (MediatR)                         │     │
│  │ • DTOs y Mapeo                               │     │
│  │ • Orquestación de servicios                  │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────────┘
                   │ Depende solo de interfaces (Ports)
                   ▼
┌──────────────────────────────────────────────────────┐
│              CAPA 3: DOMAIN                           │
│         (Núcleo de Negocio / Corazón)                │
│  ┌─────────────────────────────────────────────┐     │
│  │ • Entidades (Product, Category)              │     │
│  │ • Interfaces (Ports): IProductRepository     │     │
│  │ • Reglas de negocio puras                    │     │
│  │ • Value Objects                              │     │
│  │ • Sin dependencias externas                  │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────────┘
                   │ Implementado por Infrastructure
                   ▼
┌──────────────────────────────────────────────────────┐
│          CAPA 4: INFRASTRUCTURE                       │
│       (Adaptadores / Detalles Técnicos)              │
│  ┌─────────────────────────────────────────────┐     │
│  │ • Repositorios EF Core (Adapters)            │     │
│  │ • ApplicationDbContext                       │     │
│  │ • Configuración PostgreSQL/Redis             │     │
│  │ • Servicios de Cache                         │     │
│  │ • Migraciones de BD                          │     │
│  └─────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 CAPA 1: API (Presentación)

### **Responsabilidad Principal**
Punto de entrada HTTP del sistema. Expone endpoints REST y gestiona la comunicación con clientes externos.

### **Componentes Clave**

#### **Controllers**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IMediator _mediator;
    
    [HttpGet]
    public async Task<ActionResult<ProductListDto>> GetProducts(
        [FromQuery] int page = 1, 
        [FromQuery] int size = 10)
    {
        var query = new GetProductsQuery { Page = page, Size = size };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```

#### **Middleware Pipeline (Program.cs)**

El pipeline de middleware define el orden en que se procesan las requests HTTP. Cada middleware puede:
- Procesar la request antes de pasar al siguiente
- Ejecutar lógica después de que los middlewares posteriores terminen
- Cortar la cadena y devolver una respuesta inmediata

**Orden del Pipeline (crítico para funcionamiento correcto):**

```csharp
var app = builder.Build();

// 1. DEVELOPMENT TOOLS
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();           // Expone metadata OpenAPI en /swagger/v1/swagger.json
    app.UseSwaggerUI(c =>       // UI interactiva para probar endpoints
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ASISYA API v1");
        c.RoutePrefix = "swagger";  // Accesible en /swagger
    });
}

// 2. HTTPS REDIRECTION
app.UseHttpsRedirection();      // Redirige HTTP → HTTPS (seguridad)

// 3. CORS (Cross-Origin Resource Sharing)
app.UseCors("DevCors");         // Permite requests desde http://localhost:5173 (SPA)
                                // Configurado con: AllowAnyHeader(), AllowAnyMethod()

// 4. AUTHENTICATION
app.UseAuthentication();        // Valida JWT token del header Authorization: Bearer {token}
                                // Extrae Claims (usuario, roles) y los inyecta en HttpContext.User

// 5. AUTHORIZATION
app.UseAuthorization();         // Verifica permisos basados en [Authorize] attributes
                                // Debe ir DESPUÉS de Authentication

// 6. ROUTING
app.MapControllers();           // Mapea endpoints de controllers (/api/Product, /api/Auth)
```

**Detalles de Configuración:**

**A. JWT Authentication (Configurado en Builder)**
```csharp
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,              // Valida emisor del token
        ValidateAudience = true,            // Valida audiencia del token
        ValidateLifetime = true,            // Rechaza tokens expirados
        ValidateIssuerSigningKey = true,    // Valida firma criptográfica
        ValidIssuer = "ASISYA_ev",          // De appsettings.json
        ValidAudience = "ASISYA_ev_clients",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey) // Clave HS256 (mín. 32 chars)
        )
    };
});
```

**Flujo de Autenticación:**
1. Cliente envía: `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`
2. Middleware extrae token del header
3. Valida firma, emisor, audiencia, expiración
4. Si es válido: deserializa Claims y popula `HttpContext.User`
5. Si es inválido/expirado: retorna `401 Unauthorized`

**B. CORS (Configurado en Builder)**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy
            .WithOrigins("http://localhost:5173")  // Origen permitido (SPA)
            .AllowAnyHeader()                      // Accept, Content-Type, Authorization, etc.
            .AllowAnyMethod()                      // GET, POST, PUT, DELETE
    );
});
```

**Propósito:**
- Navegadores bloquean requests cross-origin por seguridad
- CORS permite que `http://localhost:5173` (SPA React) llame a `http://localhost:5195` (API)
- En producción: cambiar a dominio real (e.g., `https://app.asisya.com`)

**C. Swagger/OpenAPI (Solo Development)**
```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ASISYA API", Version = "v1" });
    
    // Configuración de seguridad Bearer
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingresa el token JWT en el formato: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, new List<string>() }
    });
});
```

**Características:**
- Documenta automáticamente endpoints desde atributos `[HttpGet]`, `[HttpPost]`, etc.
- UI interactiva permite probar endpoints con autenticación JWT
- Genera esquema OpenAPI 3.0 consumible por Postman, Insomnia, etc.

**Orden Crítico del Pipeline:**

| Orden | Middleware | Propósito | ¿Por qué este orden? |
|-------|-----------|-----------|----------------------|
| 1 | `UseHttpsRedirection()` | Redirigir HTTP → HTTPS | Debe ser primero para forzar seguridad |
| 2 | `UseCors()` | Permitir cross-origin | Debe procesar OPTIONS preflight antes de auth |
| 3 | `UseAuthentication()` | Validar JWT | Debe extraer usuario ANTES de verificar permisos |
| 4 | `UseAuthorization()` | Verificar permisos | Depende de `HttpContext.User` poblado por Authentication |
| 5 | `MapControllers()` | Rutear a endpoints | Debe ser último para recibir request procesada |

**⚠️ Error Común:**
Si colocas `UseAuthorization()` ANTES de `UseAuthentication()`, todos los endpoints con `[Authorize]` devolverán `401` porque `HttpContext.User` estará vacío.

**Ventajas de este Pipeline:**
- ✅ **Seguridad en capas**: HTTPS → CORS → Auth → Authorization
- ✅ **Separación de responsabilidades**: Cada middleware una función
- ✅ **Extensible**: Agregar middleware custom (logging, rate limiting) sin modificar controllers
- ✅ **Testeable**: Middlewares individuales testeables en aislamiento

### **Características Destacadas**
- ✅ **Desacoplamiento total**: Los controllers NO conocen la lógica de negocio, solo orquestan mediante MediatR
- ✅ **Validación temprana**: DTOs validan entrada antes de llegar a capas internas
- ✅ **Documentación viva**: Swagger genera docs automáticas desde atributos
- ✅ **Seguridad**: JWT, HTTPS, validación de modelos

### **Dependencias**
- ➡️ Hacia: `ASISYA_ev.Application` (MediatR Commands/Queries)
- ⬅️ Desde: Ninguna capa depende de API

### **Justificación**
Al mantener los controllers delgados y delegando toda lógica a Application via MediatR, garantizamos que cambios en protocolos de comunicación (REST → gRPC, GraphQL) NO afecten las capas internas.

---

## 💼 CAPA 2: APPLICATION (Casos de Uso)

### **Responsabilidad Principal**
Implementa los **casos de uso del negocio**. Orquesta el flujo de datos entre presentación y dominio, sin contener lógica de negocio pura.

### **Patrón CQRS: Razón y Fundamento**

#### **¿Por qué CQRS?**

**CQRS (Command Query Responsibility Segregation)** separa las operaciones de **escritura (Commands)** y **lectura (Queries)** en modelos distintos. Esta separación proporciona:

**1. Optimización Independiente**
- **Escritura**: Transaccional, con validaciones y consistencia fuerte
- **Lectura**: Optimizada con caché, índices especializados, proyecciones

**2. Escalabilidad Asimétrica**
- Sistemas típicos: 90% lecturas, 10% escrituras
- Con CQRS: escalar lecturas (replicas) sin afectar escrituras (master)

**3. Claridad en el Código**
- Cada operación es un objeto explícito (Command/Query)
- Handlers con una única responsabilidad (SRP)
- Facilita testing: mockear repositorios vs servicios de consulta

**4. Preparación para Event Sourcing**
- Commands generan eventos de dominio
- Queries leen proyecciones materializadas
- Base para arquitecturas reactivas y asíncronas

**Ventajas vs. Repository Pattern tradicional:**

| Aspecto | Repository Tradicional | CQRS |
|---------|----------------------|------|
| Operaciones | `_repo.GetAll()`, `_repo.Add()` | `GetProductsQuery`, `CreateProductCommand` |
| Optimización | Misma interfaz para todo | Lecturas con caché, escrituras transaccionales |
| Escalabilidad | Vertical (más CPU/RAM) | Horizontal (replicas lectura, master escritura) |
| Testabilidad | Tests genéricos de repo | Tests específicos por caso de uso |
| Intención | Implícita en método | Explícita en nombre (CreateProduct, GetProducts) |

---

### **Patrón CQRS Implementado en ASISYA**

#### **Commands (Escritura) - Código Real del Proyecto**

**Ejemplo 1: UpdateProductCommand (Actualizar Producto)**

```csharp
// Ubicación: ASISYA_ev.Application/Products/Commands/UpdateProductCommand.cs
using MediatR;

namespace ASISYA_ev.Application.Products.Commands
{
    /// <summary>
    /// Comando para actualizar un producto existente.
    /// RESPONSABILIDAD: Encapsular TODOS los datos necesarios para la actualización.
    /// </summary>
    public class UpdateProductCommand : IRequest<Unit>
    {
        // Propiedades inmutables (init-only)
        public int ProductID { get; }
        public string ProductName { get; }
        public int SupplierID { get; }
        public int CategoryID { get; }
        public string? QuantityPerUnit { get; }
        public decimal UnitPrice { get; }
        public short UnitsInStock { get; }
        public short UnitsOnOrder { get; }
        public short ReorderLevel { get; }
        public bool Discontinued { get; }

        // Constructor: Fuerza validación temprana (ProductName != null)
        public UpdateProductCommand(
            int productId,
            string productName,
            int supplierId,
            int categoryId,
            string? quantityPerUnit,
            decimal unitPrice,
            short unitsInStock,
            short unitsOnOrder,
            short reorderLevel,
            bool discontinued)
        {
            ProductID = productId;
            ProductName = productName ?? throw new ArgumentNullException(nameof(productName));
            SupplierID = supplierId;
            CategoryID = categoryId;
            QuantityPerUnit = quantityPerUnit;
            UnitPrice = unitPrice;
            UnitsInStock = unitsInStock;
            UnitsOnOrder = unitsOnOrder;
            ReorderLevel = reorderLevel;
            Discontinued = discontinued;
        }
    }
}
```

**Características del Command:**
- ✅ **Inmutable**: Propiedades `init-only`, no se pueden modificar después de creación
- ✅ **Validación en constructor**: Rechaza datos inválidos tempranamente
- ✅ **Intención clara**: Nombre descriptivo (`UpdateProductCommand`, no `ProductDto`)
- ✅ **Sin lógica**: Solo estructura de datos (DTOs mutables → Commands inmutables)
- ✅ **IRequest<Unit>**: Unit = operación sin retorno (void en MediatR)

---

**Handler del Command: UpdateProductHandler**

```csharp
// Ubicación: ASISYA_ev.Application/Products/Commands/UpdateProductHandler.cs
using MediatR;
using ASISYA_ev.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace ASISYA_ev.Application.Products.Commands
{
    /// <summary>
    /// Handler para procesar la actualización de un producto.
    /// RESPONSABILIDAD: Orquestar la operación (validar → actualizar → invalidar caché).
    /// </summary>
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Unit>
    {
        private readonly IProductRepository _repository;  // Puerto de escritura
        private readonly IDistributedCache _cache;        // Infraestructura (Redis)

        public UpdateProductHandler(IProductRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            // PASO 1: Obtener entidad existente
            var product = await _repository.GetByIdAsync(request.ProductID);
            if (product == null)
            {
                throw new KeyNotFoundException($"Producto con ID {request.ProductID} no encontrado");
            }

            // PASO 2: Actualizar propiedades (lógica de negocio podría ir aquí)
            product.ProductName = request.ProductName;
            product.SupplierID = request.SupplierID;
            product.CategoryID = request.CategoryID;
            product.QuantityPerUnit = request.QuantityPerUnit;
            product.UnitPrice = request.UnitPrice;
            product.UnitsInStock = request.UnitsInStock;
            product.UnitsOnOrder = request.UnitsOnOrder;
            product.ReorderLevel = request.ReorderLevel;
            product.Discontinued = request.Discontinued;

            // PASO 3: Persistir cambios (transacción implícita en EF Core)
            await _repository.UpdateAsync(product);

            // PASO 4: Invalidar caché del detalle específico
            var detailCacheKey = $"product:detail:{request.ProductID}";
            await _cache.RemoveAsync(detailCacheKey, cancellationToken);

            // PASO 5: Invalidar caché de TODOS los listados (versionado)
            // Incrementar versión global para que todas las queries regeneren sus cachés
            var versionKey = "product:list:version";
            var currentVersion = await _cache.GetStringAsync(versionKey, cancellationToken);
            if (!int.TryParse(currentVersion, out var version)) version = 0;
            await _cache.SetStringAsync(versionKey, (version + 1).ToString(), cancellationToken);

            return Unit.Value;  // Operación completada sin retorno
        }
    }
}
```

**Flujo del Handler (Escritura):**
```
Request → Validar existencia → Modificar entidad → Persistir BD → Invalidar caché → Unit.Value
```

**Características del Handler:**
- ✅ **Orquestación**: Coordina repositorio + caché + validaciones
- ✅ **Transaccional**: EF Core garantiza atomicidad (todo o nada)
- ✅ **Invalidación de caché**: Mantiene consistencia eventual
- ✅ **Manejo de errores**: Lanza excepciones descriptivas

---

#### **Queries (Lectura) - Código Real del Proyecto**

**Ejemplo 2: GetProductsQuery (Listar Productos Paginados)**

```csharp
// Ubicación: ASISYA_ev.Application/Products/Queries/GetProductsQuery.cs
using MediatR;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Application.Products.Queries
{
    /// <summary>
    /// Query para obtener una lista paginada de productos con filtros y búsqueda.
    /// RESPONSABILIDAD: Encapsular parámetros de consulta.
    /// </summary>
    public class GetProductsQuery : IRequest<PaginatedList<ProductListDto>>
    {
        public int PageNumber { get; }
        public int PageSize { get; }
        public string? Filter { get; }
        public string? Search { get; }

        public GetProductsQuery(int pageNumber, int pageSize, string? filter = null, string? search = null)
        {
            // Validación: páginas válidas
            if (pageNumber < 1) throw new ArgumentException("PageNumber debe ser >= 1");
            if (pageSize < 1 || pageSize > 100) throw new ArgumentException("PageSize debe estar entre 1 y 100");

            PageNumber = pageNumber;
            PageSize = pageSize;
            Filter = filter;
            Search = search;
        }
    }
}
```

**Características del Query:**
- ✅ **Inmutable**: Parámetros fijos en construcción
- ✅ **Validación temprana**: Rechaza paginaciones inválidas
- ✅ **Sin efectos secundarios**: Solo define CÓMO consultar, no ejecuta
- ✅ **IRequest<T>**: Retorna tipo específico (`PaginatedList<ProductListDto>`)

---

**Handler del Query: GetProductsHandler**

```csharp
// Ubicación: ASISYA_ev.Application/Products/Queries/GetProductsHandler.cs
using MediatR;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Interfaces;

namespace ASISYA_ev.Application.Products.Queries
{
    /// <summary>
    /// Handler para procesar consultas paginadas de productos.
    /// RESPONSABILIDAD: Delegar a servicio de consulta optimizado (con caché).
    /// </summary>
    public class GetProductsHandler : IRequestHandler<GetProductsQuery, PaginatedList<ProductListDto>>
    {
        // Puerto de LECTURA (diferente del repositorio de escritura)
        private readonly IProductQueryService _queryService;

        public GetProductsHandler(IProductQueryService queryService)
        {
            _queryService = queryService;
        }

        public async Task<PaginatedList<ProductListDto>> Handle(
            GetProductsQuery request, 
            CancellationToken cancellationToken)
        {
            // ÚNICA RESPONSABILIDAD: Delegar al servicio de consulta optimizado
            // El servicio maneja:
            // 1. Verificar caché (key = product:list:v{version}:{page}:{size}:{filter})
            // 2. Si caché miss: consultar BD con paginación + índices
            // 3. Mapear entidades → DTOs
            // 4. Cachear resultado (TTL: 2 minutos)
            // 5. Retornar
            var result = await _queryService.GetPaginatedProductsAsync(
                request.PageNumber,
                request.PageSize,
                request.Filter
            );

            return result;
        }
    }
}
```

**Flujo del Handler (Lectura):**
```
Request → Servicio de consulta → Verificar caché Redis
                                   ├─ HIT: Retornar JSON deserializado
                                   └─ MISS: BD (índices) → Mapear DTOs → Cachear → Retornar
```

**Características del Handler:**
- ✅ **Delegación pura**: No contiene lógica de consulta, solo orquesta
- ✅ **Caché transparente**: El handler no conoce los detalles del caché
- ✅ **Optimizado para lectura**: Servicio especializado (`IProductQueryService`)
- ✅ **Sin escritura**: Garantía de operación idempotente (sin efectos secundarios)

---

#### **Comparación: Commands vs Queries**

| Aspecto | Commands (Escritura) | Queries (Lectura) |
|---------|---------------------|-------------------|
| **Propósito** | Modificar estado del sistema | Consultar estado sin modificarlo |
| **Retorno** | `Unit` (void) o ID del recurso | DTOs con datos solicitados |
| **Caché** | Invalida (Remove, incrementar versión) | Lee de caché o regenera |
| **Transaccionalidad** | Sí (commit/rollback) | No (solo lectura) |
| **Validación** | Reglas de negocio complejas | Validación de parámetros |
| **Escalabilidad** | Vertical (master DB) | Horizontal (replicas + caché) |
| **Ejemplo** | `UpdateProductCommand` | `GetProductsQuery` |

---

#### **Ventajas CQRS en ASISYA**

**1. Performance Optimizada**
```csharp
// Escritura: Sin caché, con transacción
await _repository.UpdateAsync(product);  // PostgreSQL master

// Lectura: Con caché, sin lock
var cached = await _cache.GetStringAsync(cacheKey);  // Redis (90% hits)
if (cached != null) return Deserialize(cached);      // Latencia < 5ms
```

**2. Escalabilidad Horizontal**
```
┌─────────────────┐
│   API Gateway   │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼───┐  ┌──▼──────┐
│Write  │  │Read     │
│Master │  │Replicas │
│(1x)   │  │(10x)    │
└───────┘  └─────────┘
              ▲
              │ Cache Redis
```

**3. Mantenibilidad: Handlers Pequeños y Enfocados**
```csharp
// Cada handler hace UNA cosa:
UpdateProductHandler  → Actualizar + invalidar caché
GetProductsHandler    → Consultar con caché
DeleteProductHandler  → Eliminar + invalidar caché
CreateProductHandler  → Crear + invalidar caché
```

**4. Testing Simplificado**
```csharp
// Test unitario de Command (mock de repositorio)
[Fact]
public async Task UpdateProduct_ShouldInvalidateCache()
{
    var mockRepo = new Mock<IProductRepository>();
    var mockCache = new Mock<IDistributedCache>();
    var handler = new UpdateProductHandler(mockRepo.Object, mockCache.Object);
    
    await handler.Handle(command, CancellationToken.None);
    
    mockCache.Verify(c => c.RemoveAsync("product:detail:1", ...), Times.Once);
}

// Test de Query (mock de servicio de consulta)
[Fact]
public async Task GetProducts_ShouldReturnPaginatedList()
{
    var mockService = new Mock<IProductQueryService>();
    mockService.Setup(s => s.GetPaginatedProductsAsync(1, 10, null))
               .ReturnsAsync(new PaginatedList<ProductListDto>(...));
    var handler = new GetProductsHandler(mockService.Object);
    
    var result = await handler.Handle(query, CancellationToken.None);
    
    Assert.Equal(10, result.Items.Count);
}
```

### **Características Destacadas**
- ✅ **Separación Comando/Consulta**: Optimizaciones independientes (escritura vs lectura)
- ✅ **Mediator Pattern**: Desacopla controllers de handlers
- ✅ **DTOs explícitos**: Nunca exponemos entidades de dominio directamente
- ✅ **Validación de negocio**: Reglas complejas aplicadas antes de persistencia
- ✅ **Caché inteligente**: Invalidación selectiva en comandos

### **Dependencias**
- ➡️ Hacia: `ASISYA_ev.Domain` (Entidades, Interfaces)
- ⬅️ Desde: `ASISYA_ev.Api` (Controllers)

### **Justificación**
CQRS permite escalar lecturas y escrituras de forma independiente. Los handlers concentran la lógica de orquestación, haciendo el código altamente testeable mediante mocks de repositorios.

---

## 🧬 CAPA 3: DOMAIN (Núcleo de Negocio)

### **Responsabilidad Principal**
Contiene el **corazón del negocio**: entidades, reglas de dominio y contratos (interfaces). Es la capa más importante y estable del sistema.

### **Componentes Clave**

#### **Entidades de Dominio**
```csharp
public class Product
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public decimal Price { get; private set; }
    public int CategoryId { get; private set; }
    public bool IsActive { get; private set; }
    
    // Constructor: Valida reglas de negocio
    public Product(string name, decimal price, int categoryId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("El nombre es obligatorio");
        
        if (price <= 0)
            throw new ArgumentException("El precio debe ser mayor a cero");
        
        Name = name;
        Price = price;
        CategoryId = categoryId;
        IsActive = true;
    }
    
    // Métodos de negocio
    public void Deactivate()
    {
        IsActive = false;
    }
    
    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new ArgumentException("Precio inválido");
        Price = newPrice;
    }
}
```

#### **Interfaces (Ports)**
```csharp
// Puerto: Contrato de persistencia
public interface IProductRepository
{
    Task<Product?> GetByIdAsync(int id);
    Task<IEnumerable<Product>> GetAllAsync();
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(int id);
}

// Puerto: Contrato de consultas optimizadas
public interface IProductQueryService
{
    Task<ProductListDto> GetPagedAsync(int page, int size, string? filter = null);
    Task<ProductDto?> GetDetailAsync(int id);
}
```

### **Características Destacadas**
- ✅ **Independencia total**: Sin referencias a frameworks, ORMs o librerías externas
- ✅ **Encapsulación**: Setters privados, validación en constructores
- ✅ **Invariantes**: Las entidades siempre están en estado válido
- ✅ **Puertos (Interfaces)**: Definen contratos, no implementaciones
- ✅ **Testeable**: Lógica de negocio testeable sin BD ni infraestructura

### **Dependencias**
- ➡️ Hacia: **NINGUNA** (esta es la clave de Clean Architecture)
- ⬅️ Desde: `Application`, `Infrastructure`

### **Justificación**
Al mantener el dominio libre de dependencias, garantizamos que las reglas de negocio sobreviven a cambios tecnológicos (migración de BD, cambio de framework). Es la capa más valiosa intelectualmente.

---

## 🔧 CAPA 4: INFRASTRUCTURE (Adaptadores)

### **Responsabilidad Principal**
Implementa los **detalles técnicos** y conecta el dominio con tecnologías externas (BD, caché, APIs). Es la capa más "reemplazable".

### **Componentes Clave**

#### **Repositorio (Adapter)**
```csharp
public class EFCoreProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;
    
    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
    
    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
    }
    
    // Bulk insert optimizado para 100k+ productos
    public async Task AddRangeAsync(IEnumerable<Product> products)
    {
        await _context.BulkInsertAsync(products);
    }
}
```

#### **DbContext (EF Core)**
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuración de entidades
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.HasIndex(p => p.Name); // Índice para búsquedas
        });
    }
}
```

#### **Servicio de Caché**
```csharp
public class ProductQueryService : IProductQueryService
{
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;
    
    public async Task<ProductListDto> GetPagedAsync(int page, int size, string? filter)
    {
        var cacheKey = $"product:list:v{version}:{page}:{size}:{filter}";
        
        // Intentar obtener desde caché
        var cached = await _cache.GetStringAsync(cacheKey);
        if (cached != null)
            return JsonSerializer.Deserialize<ProductListDto>(cached);
        
        // Consultar BD con paginación
        var query = _context.Products.AsQueryable();
        if (!string.IsNullOrEmpty(filter))
            query = query.Where(p => p.Name.Contains(filter));
        
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();
        
        var result = new ProductListDto
        {
            Items = items.Select(ProductDto.FromEntity),
            TotalCount = total,
            Page = page,
            Size = size
        };
        
        // Cachear resultado (TTL: 2 minutos)
        await _cache.SetStringAsync(
            cacheKey, 
            JsonSerializer.Serialize(result),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2) }
        );
        
        return result;
    }
}
```

### **Características Destacadas**
- ✅ **Implementa los Ports**: Los repositorios implementan interfaces de Domain
- ✅ **EF Core**: ORM con migraciones, tracking, lazy loading
- ✅ **Caché distribuida**: Redis para escalabilidad horizontal
- ✅ **Bulk operations**: Inserciones masivas optimizadas (100k+ registros en segundos)
- ✅ **Configuración externa**: Connection strings vía variables de entorno

### **Dependencias**
- ➡️ Hacia: `ASISYA_ev.Domain` (implementa interfaces)
- ⬅️ Desde: `ASISYA_ev.Application` (usa los adaptadores)

### **Justificación**
Al aislar toda interacción con BD/caché en esta capa, podemos reemplazar PostgreSQL por SQL Server, o Redis por Memcached, sin tocar Application ni Domain. Solo cambiamos los adaptadores.

---

## 🔄 Flujo Completo de una Request

### **Ejemplo: POST /api/product (Crear Producto)**

```
1. Cliente HTTP → POST /api/product
   Body: { "name": "Laptop Dell", "price": 1200, "categoryId": 5 }

2. API Layer (ProductController)
   ↓ Validación de entrada (ModelState)
   ↓ Crea Command: CreateProductCommand
   ↓ Envía a MediatR: _mediator.Send(command)

3. Application Layer (CreateProductHandler)
   ↓ Valida reglas de negocio
   ↓ Crea entidad: new Product(...)
   ↓ Llama al repositorio: _repository.AddAsync(product)
   ↓ Invalida caché de listados
   ↓ Retorna DTO: ProductDto

4. Infrastructure Layer (EFCoreProductRepository)
   ↓ _context.Products.AddAsync(product)
   ↓ _context.SaveChangesAsync()
   ↓ PostgreSQL: INSERT INTO products ...

5. Response
   ← HTTP 201 Created + ProductDto en JSON
```

### **Ejemplo: GET /api/product?page=1&size=10 (Listar Productos)**

```
1. Cliente HTTP → GET /api/product?page=1&size=10

2. API Layer (ProductController)
   ↓ Crea Query: GetProductsQuery
   ↓ Envía a MediatR: _mediator.Send(query)

3. Application Layer (GetProductsHandler)
   ↓ Llama al servicio de consulta: _queryService.GetPagedAsync(...)

4. Infrastructure Layer (ProductQueryService)
   ↓ Calcula cache key: "product:list:v5:1:10"
   ↓ Redis GET cache_key
   ├─ Si existe → Deserializa y retorna
   └─ Si NO existe:
       ↓ PostgreSQL: SELECT * FROM products LIMIT 10 OFFSET 0
       ↓ Mapea a DTOs
       ↓ Redis SET cache_key (TTL: 2 min)
       ↓ Retorna ProductListDto

5. Response
   ← HTTP 200 OK + ProductListDto en JSON
```

---

## 🎯 Ventajas de esta Arquitectura

### **1. Mantenibilidad**
- Cada capa tiene una responsabilidad clara (SRP)
- Cambios en UI no afectan lógica de negocio
- Cambios en BD no afectan casos de uso

### **2. Testeabilidad**
- Domain: Tests unitarios puros sin mocks
- Application: Tests con mocks de repositorios
- Infrastructure: Tests de integración con BD real
- API: Tests end-to-end con TestServer

### **3. Escalabilidad**
- CQRS permite escalar lecturas (replicas de BD) y escrituras independientemente
- Caché distribuida (Redis) para alta concurrencia
- Arquitectura preparada para microservicios (separar Commands y Queries)

### **4. Flexibilidad Tecnológica**
- Migrar de PostgreSQL a SQL Server: solo cambiar Infrastructure
- Cambiar de REST a gRPC: solo cambiar API
- Agregar GraphQL: nueva capa de presentación sin tocar Application

### **5. Reglas de Negocio Protegidas**
- Domain no tiene dependencias externas
- Lógica crítica no se corrompe con detalles técnicos
- Facilita auditoría y compliance

---

## 📊 Métricas de Calidad

### **Desacoplamiento (Bajo Acoplamiento)**
- Domain: 0 dependencias externas ✅
- Application: Solo depende de Domain ✅
- Infrastructure: Implementa contratos de Domain ✅
- API: Solo depende de Application ✅

### **Cohesión (Alta Cohesión)**
- Cada capa agrupa responsabilidades relacionadas
- Cada handler tiene una única responsabilidad (CQRS)
- Entidades de dominio encapsulan estado + comportamiento

### **Principios SOLID**
- **S**ingle Responsibility: Cada handler, repositorio, entidad
- **O**pen/Closed: Extensible via nuevos handlers sin modificar existentes
- **L**iskov Substitution: Interfaces permiten implementaciones intercambiables
- **I**nterface Segregation: Interfaces pequeñas y específicas (IProductRepository)
- **D**ependency Inversion: Capas superiores dependen de abstracciones (Ports)

---

## 🚀 Conclusión

La arquitectura en 4 capas de ASISYA garantiza un sistema:

✅ **Mantenible**: Cambios localizados, bajo impacto
✅ **Escalable**: Preparado para crecimiento de usuarios y datos
✅ **Testeable**: Cobertura de tests en todos los niveles
✅ **Flexible**: Tecnologías reemplazables sin refactorización masiva
✅ **Profesional**: Siguiendo mejores prácticas de la industria

Esta arquitectura es ideal para proyectos empresariales que requieren evolución continua, equipos distribuidos y alta calidad de código.

---

**Tecnologías Clave:**
- .NET 9.0 | C# 12 | Entity Framework Core 9
- PostgreSQL 15 | Redis | Docker
- MediatR | CQRS | Clean Architecture

**Preparado para:**
- Microservicios
- Cloud (AWS, Azure, GCP)
- CI/CD (GitHub Actions)
- Alta disponibilidad

---

## 🔄 FLUJO COMPLETO DE UNA REQUEST: GET /api/Product

### **Escenario Real**
Un usuario abre la aplicación web y hace click en "Ver Productos". Veamos cómo viaja esta petición a través de todas las capas del sistema.

---

### **📊 Diagrama Visual del Flujo**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENTE (Navegador/SPA)                          │
│                                                                            │
│  Usuario hace click en "Productos" → Axios envía GET request             │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTP GET /api/product?page=1&size=10
                                  │ Headers: { Authorization: Bearer <JWT> }
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        CAPA 1: API (Presentación)                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  1. Middleware Pipeline                                         │      │
│  │     ├─ UseHttpsRedirection() → Verifica HTTPS                  │      │
│  │     ├─ UseCors() → Permite origen localhost:5173               │      │
│  │     ├─ UseAuthentication() → Valida JWT, extrae Claims         │      │
│  │     └─ UseAuthorization() → Verifica permisos [Authorize]      │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  2. ProductController.GetProducts(page, size)                   │      │
│  │     • Recibe parámetros validados: page=1, size=10             │      │
│  │     • Crea objeto Query: new GetProductsQuery(1, 10)           │      │
│  │     • NO conoce la base de datos ni caché                      │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ var result = await _mediator.Send(query)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    CAPA 2: APPLICATION (Casos de Uso)                     │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  3. MediatR (Mediador)                                          │      │
│  │     • Recibe: GetProductsQuery                                  │      │
│  │     • Busca el Handler registrado para este Query              │      │
│  │     • Inyecta dependencias (IProductQueryService)              │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  4. GetProductsHandler.Handle(query, cancellationToken)         │      │
│  │     • Recibe página y tamaño desde el Query                    │      │
│  │     • Delega la consulta al servicio especializado:            │      │
│  │       await _queryService.GetPaginatedProductsAsync(1, 10)     │      │
│  │     • NO ejecuta SQL directamente, usa el Port (interfaz)      │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ Llamada a interfaz (Port)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  CAPA 4: INFRASTRUCTURE (Adaptadores)                     │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  5. ProductQueryService (Implementación del Port)               │      │
│  │     A) Construye cache key:                                     │      │
│  │        key = "product:list:v5:page1:size10"                    │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  6. Redis Cache (Verificación)                                  │      │
│  │     • GET product:list:v5:page1:size10                         │      │
│  │     ┌─────────────────────────────────────────────────────┐   │      │
│  │     │  ¿Existe en caché?                                   │   │      │
│  │     │  ├─ SÍ (Cache HIT) → Deserializa JSON y retorna     │   │      │
│  │     │  │                     [Latencia: ~5ms] ⚡             │   │      │
│  │     │  └─ NO (Cache MISS) → Continúa al paso 7 ▼          │   │      │
│  │     └─────────────────────────────────────────────────────┘   │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼ (Si Cache MISS)                        │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  7. ApplicationDbContext (EF Core)                              │      │
│  │     • Construye consulta LINQ:                                  │      │
│  │       var query = _context.Products                            │      │
│  │                   .Include(p => p.Category)                    │      │
│  │                   .Where(p => p.IsActive)                      │      │
│  │                   .OrderBy(p => p.ProductName)                 │      │
│  │                   .Skip((page - 1) * size)  // Skip 0          │      │
│  │                   .Take(size);              // Take 10         │      │
│  │     • EF Core traduce LINQ → SQL                               │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  8. Npgsql (Driver PostgreSQL)                                  │      │
│  │     • Abre conexión TCP a PostgreSQL (localhost:5432)          │      │
│  │     • Ejecuta SQL generado por EF Core:                        │      │
│  │       SELECT p.*, c.*                                          │      │
│  │       FROM products p                                          │      │
│  │       INNER JOIN categories c ON p.category_id = c.id         │      │
│  │       WHERE p.is_active = true                                 │      │
│  │       ORDER BY p.product_name                                  │      │
│  │       LIMIT 10 OFFSET 0;                                       │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ Query SQL enviado
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS (PostgreSQL)                           │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  9. PostgreSQL Server                                           │      │
│  │     • Recibe query SQL                                          │      │
│  │     • Consulta índice B-Tree en product_name                   │      │
│  │     • Lee páginas de disco (o buffer cache)                    │      │
│  │     • Ejecuta JOIN con tabla categories                        │      │
│  │     • Aplica LIMIT/OFFSET (paginación)                         │      │
│  │     • Retorna 10 filas (result set)                            │      │
│  │       [Latencia: ~50-100ms] 🔍                                  │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ Datos crudos (tablas relacionales)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  CAPA 4: INFRASTRUCTURE (Regreso)                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  10. EF Core (Materialización)                                  │      │
│  │      • Convierte filas SQL → Objetos Product (Entidades)       │      │
│  │      • Tracking de cambios (opcional, deshabilitado en queries)│      │
│  │      • Retorna: List<Product>                                  │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  11. ProductQueryService (Mapeo a DTOs)                         │      │
│  │      • Mapea entidades → DTOs (sin propiedades internas):      │      │
│  │        Product → ProductListDto                                │      │
│  │        {                                                        │      │
│  │          Id = product.ProductID,                               │      │
│  │          Name = product.ProductName,                           │      │
│  │          Price = product.UnitPrice,                            │      │
│  │          CategoryName = product.Category.CategoryName          │      │
│  │        }                                                        │      │
│  │      • Crea objeto paginado:                                   │      │
│  │        PaginatedList<ProductListDto>                           │      │
│  │        {                                                        │      │
│  │          Items = [dto1, dto2, ..., dto10],                    │      │
│  │          TotalCount = 500,                                     │      │
│  │          PageNumber = 1,                                       │      │
│  │          TotalPages = 50                                       │      │
│  │        }                                                        │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  12. Redis Cache (Almacenamiento)                               │      │
│  │      • Serializa PaginatedList → JSON                          │      │
│  │      • SET product:list:v5:page1:size10 = "{...json...}"      │      │
│  │      • EXPIRE key 120 (TTL: 2 minutos)                         │      │
│  │      • Próximas requests a esta página: Cache HIT ⚡            │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ Retorna PaginatedList<ProductListDto>
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    CAPA 2: APPLICATION (Regreso)                          │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  13. GetProductsHandler (Retorno)                               │      │
│  │      • Recibe PaginatedList desde el servicio                  │      │
│  │      • Retorna al Mediator sin modificaciones                  │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  14. MediatR (Retorno al Controller)                            │      │
│  │      • Envía resultado al Controller que invocó Send()         │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ return result
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        CAPA 1: API (Regreso)                              │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  15. ProductController (Serialización)                          │      │
│  │      • Recibe PaginatedList<ProductListDto>                    │      │
│  │      • ASP.NET Core serializa automáticamente a JSON:          │      │
│  │        {                                                        │      │
│  │          "items": [                                            │      │
│  │            {                                                    │      │
│  │              "id": 1,                                          │      │
│  │              "name": "Laptop Dell XPS 15",                     │      │
│  │              "price": 1299.99,                                 │      │
│  │              "categoryName": "LAPTOPS"                         │      │
│  │            },                                                   │      │
│  │            ...                                                  │      │
│  │          ],                                                     │      │
│  │          "totalCount": 500,                                    │      │
│  │          "pageNumber": 1,                                      │      │
│  │          "totalPages": 50                                      │      │
│  │        }                                                        │      │
│  │      • Retorna: Ok(result) → HTTP 200                          │      │
│  └────────────────────────────────────────────────────────────────┘      │
└────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTP 200 OK
                                  │ Content-Type: application/json
                                  │ Body: { "items": [...], "totalCount": 500 }
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENTE (Navegador/SPA)                          │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  16. Axios (Frontend)                                           │      │
│  │      • Recibe respuesta JSON                                    │      │
│  │      • Deserializa: response.data                              │      │
│  │      • React actualiza estado:                                 │      │
│  │        setProducts(response.data.items)                        │      │
│  │        setTotalPages(response.data.totalPages)                 │      │
│  └────────────────────────────────────────────────────────────────┘      │
│                                  ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  17. React Component (Renderizado)                              │      │
│  │      • Mapea array de productos a elementos <tr>               │      │
│  │      • Muestra tabla con 10 productos                          │      │
│  │      • Renderiza controles de paginación (1 de 50)             │      │
│  │      • Usuario ve la lista en pantalla ✅                       │      │
│  └────────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### **📝 Explicación en Lenguaje Natural**

**Imagina que estás en un restaurante elegante:**

**1. Cliente pide el menú (HTTP Request)**
- Tú (el usuario) le dices al mesero: "Quiero ver los productos, página 1, dame 10 por favor"
- El mesero (navegador) escribe tu pedido en una nota y se la entrega al maître

**2. Maître recibe la orden (ProductController)**
- El maître (controller) recibe tu pedido
- NO va directo a la cocina, sino que le pasa la orden al coordinador general
- Crea un ticket formal: "GetProductsQuery: página 1, tamaño 10"

**3. Coordinador General (MediatR)**
- El coordinador (mediator) ve el ticket
- Busca en su lista: "¿Quién maneja pedidos de productos?"
- Encuentra al chef especializado: GetProductsHandler

**4. Chef Especializado (Handler)**
- El chef recibe el ticket
- NO cocina directamente, sino que le dice al sous-chef: "Tráeme 10 productos de la página 1"
- El sous-chef es el ProductQueryService

**5-6. Sous-Chef revisa la Nevera Rápida (Redis Cache)**
- Antes de ir al almacén, revisa la nevera rápida (Redis)
- Busca: "¿Ya tenemos productos página 1 preparados?"
- **Si SÍ (Cache HIT)**: ¡Perfecto! Los saca de la nevera y termina en 5ms ⚡
- **Si NO (Cache MISS)**: Tiene que ir al almacén (PostgreSQL)

**7-9. Ir al Almacén (PostgreSQL)**
- El sous-chef baja al almacén (base de datos)
- Le dice al encargado (EF Core): "Dame 10 productos, ordenados por nombre, salta los primeros 0"
- EF Core traduce esto a lenguaje del almacén (SQL)
- El almacenero (PostgreSQL) busca en sus estantes organizados (índices)
- Encuentra 10 productos y se los entrega en cajas (filas SQL)
- Esto toma ~50-100ms 🔍

**10-11. Empaquetar (Mapeo a DTOs)**
- El sous-chef recibe las cajas del almacén
- Las abre y saca solo la información que el cliente necesita (Product → ProductListDto)
- NO le va a dar al cliente el código de barras interno o el número de estante
- Crea un paquete bonito con:
  - 10 productos en una bandeja
  - Una nota que dice: "Tienes 500 productos en total, esta es la página 1 de 50"

**12. Guardar en Nevera Rápida (Redis Cache)**
- Antes de subir, guarda una copia en la nevera (Redis)
- Pone una etiqueta: "product:list:v5:page1:size10"
- Programa un temporizador: "Esto es fresco por 2 minutos"
- La próxima vez que alguien pida lo mismo: ¡ya está listo! ⚡

**13-15. Regresar al Cliente (Response)**
- El sous-chef le da el paquete al chef
- El chef se lo da al coordinador
- El coordinador se lo da al maître
- El maître (controller) lo envuelve en papel bonito (JSON)
- Se lo entrega al mesero (navegador)

**16-17. Cliente Recibe su Orden**
- El mesero te trae el menú (JSON con 10 productos)
- Tú ves una tabla bonita en tu pantalla con:
  - Laptop Dell XPS 15 - $1,299.99
  - Monitor Samsung 27" - $399.99
  - ... 8 productos más
- Y un botón que dice: "Página 1 de 50" para ver más

---

### **⏱️ Tiempos de Respuesta**

| Escenario | Tiempo Total | Detalles |
|-----------|--------------|----------|
| **Cache HIT (90% de casos)** | ~10-20ms | Redis + serialización ⚡ |
| **Cache MISS (10% de casos)** | ~80-150ms | PostgreSQL + mapeo + cachear 🔍 |
| **Primera request del día** | ~150-200ms | Caché vacío + índices fríos ❄️ |

**¿Por qué es tan rápido con caché?**
- Redis almacena datos en memoria RAM (no en disco)
- JSON pre-serializado (no hay que mapear entidades)
- Sin queries SQL (sin espera de red/disco)
- 90% de las requests NO tocan PostgreSQL 🚀

---

### **🔄 Flujo Simplificado (Vista de Pájaro)**

```
Cliente → Controller → MediatR → Handler → QueryService
                                              ├─ Redis (90% HIT) ⚡
                                              └─ PostgreSQL (10% MISS) → Cachear 🔍
QueryService → Handler → MediatR → Controller → Cliente
```

---

### **🎯 Puntos Clave de la Arquitectura**

**1. Separación de Responsabilidades**
- Controller: Solo recibe y devuelve
- Handler: Solo orquesta
- QueryService: Solo consulta y cachea
- PostgreSQL: Solo almacena

**2. Caché Inteligente**
- Redis actúa como "memoria fotográfica" del sistema
- 90% de requests nunca llegan a PostgreSQL
- Reduce latencia de 100ms a 10ms (10x más rápido)

**3. Arquitectura Limpia**
- Capas externas NO conocen capas internas
- Controller NO sabe que existe PostgreSQL
- Handler NO sabe que existe Redis
- Cada capa puede cambiar independientemente

**4. Escalabilidad**
- PostgreSQL maneja 10% de requests (escrituras + cache misses)
- Redis maneja 90% de requests (lecturas cacheadas)
- Podemos agregar más réplicas de PostgreSQL sin cambiar código
- Podemos agregar más nodos de Redis sin cambiar código

Este flujo se repite **miles de veces por minuto** en producción, y gracias a CQRS + Caché, el sistema responde instantáneamente ⚡
