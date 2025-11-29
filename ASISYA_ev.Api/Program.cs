

using Microsoft.EntityFrameworkCore;

using ASISYA_ev.Domain.Interfaces;
using ASISYA_ev.Infrastructure.Data;
using ASISYA_ev.Application.Products.Commands;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// ApplicationDbContext está en ASISYA_ev.Infrastructure.Data


// Asegúrate de incluir los namespaces de tus entidades
// using MiProyecto.Dominio.Entidades;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Dentro de Program.cs, después de builder.Services

// 1. Registrar MediatR: Escanea el assembly de Application en busca de Handlers
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateProductsBatchCommand).Assembly));

// ...

// Registro de Repositorios y Servicios de Consulta (Adaptadores)
// 1. Registro del Repositorio de Escritura (Commands)
builder.Services.AddScoped<IProductRepository, EFCoreProductRepository>();
builder.Services.AddScoped<ICategoryRepository, EFCoreCategoryRepository>();

// 2. Registro del Servicio de Consulta (Queries)
builder.Services.AddScoped<IProductQueryService, ProductQueryService>();

// Configuración del DbContext (PostgreSQL con Npgsql) o InMemory para pruebas
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useInMemoryForTests = builder.Configuration.GetValue<bool>("UseInMemoryForTests");
var forceInMemory = builder.Configuration.GetValue<bool>("ForceInMemory");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (useInMemoryForTests || forceInMemory)
    {
        options.UseInMemoryDatabase("TestDb");
    }
    else
    {
        // Usamos el proveedor Npgsql para PostgreSQL
        options.UseNpgsql(connectionString);
    }
});

// Configuración del Distributed Cache (Redis)
var redisHost = builder.Configuration["CacheSettings:RedisHost"];
if (useInMemoryForTests || forceInMemory)
{
    // En entorno de pruebas, evitar dependencia externa a Redis
    builder.Services.AddDistributedMemoryCache();
}
else
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisHost;
        options.InstanceName = "master";
    });
}


// Otros servicios (Controladores, Swashbuckle, etc.)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configurar esquema de seguridad Bearer para Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "ASISYA API", Version = "v1" });
    var securityScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingresa el token JWT en el formato: Bearer {token}",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new Microsoft.OpenApi.Models.OpenApiReference
        {
            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    var securityRequirement = new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            securityScheme,
            new List<string>()
        }
    };
    c.AddSecurityRequirement(securityRequirement);
});

// CORS para permitir llamadas desde la SPA (Vite dev server)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

// JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSection.GetValue<string>("SecretKey") ?? string.Empty;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection.GetValue<string>("Issuer"),
        ValidAudience = jwtSection.GetValue<string>("Audience"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ASISYA API v1");
        c.RoutePrefix = "swagger";
    });
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("DevCors");
app.UseAuthentication();
app.UseAuthorization();

// Mapear controladores para habilitar rutas como /api/Auth y /api/Product
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();


record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public partial class Program { }
