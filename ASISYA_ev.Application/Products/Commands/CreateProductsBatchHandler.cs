using MediatR;
using ASISYA_ev.Domain.Interfaces;
using ASISYA_ev.Domain.Entidades;
using ASISYA_ev.Application.Products.Commands;
using Microsoft.Extensions.Caching.Distributed;

namespace ASISYA_ev.Application.Products.Commands
{
    // Commands/CreateProductsBatchHandler.cs
    public class CreateProductsBatchHandler : IRequestHandler<CreateProductsBatchCommand, Unit>
    {
    private readonly IProductRepository _productRepository;
    private readonly IDistributedCache _cache;
        // private readonly IMapper _mapper;

        public CreateProductsBatchHandler(IProductRepository productRepository /*, IMapper mapper */, IDistributedCache cache)
        {
            _productRepository = productRepository;
            _cache = cache;
            // _mapper = mapper;
        }

        public async Task<Unit> Handle(CreateProductsBatchCommand request, CancellationToken cancellationToken)
        {
            // 1. Mapeo de DTOs a Entidades de Dominio
            var productsToInsert = request.Products
                .Select(dto => new Product
                {
                    ProductName = dto.ProductName,
                    SupplierID = dto.SupplierID,
                    CategoryID = dto.CategoryID,
                    UnitPrice = dto.UnitPrice,
                    UnitsInStock = dto.UnitsInStock
                    // ... (Mapear todos los campos)
                })
                .ToList();

            // 2. Ejecutar la operación de Batch Insert (Lógica eficiente)
            await _productRepository.BulkInsertAsync(productsToInsert);

            // Bust global de listados incrementando versión (tolerante a errores de caché)
            try
            {
                var version = await _cache.GetStringAsync("product:list:version", cancellationToken);
                if (!int.TryParse(version, out var v)) v = 0;
                await _cache.SetStringAsync("product:list:version", (v + 1).ToString(), cancellationToken);
            }
            catch
            {
                // Ignorar errores de caché en pruebas o cuando Redis no esté disponible
            }

            return Unit.Value;
        }
    }
}
