using MediatR;
using ASISYA_ev.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace ASISYA_ev.Application.Products.Commands
{
    /// <summary>
    /// Handler para actualizar un producto existente.
    /// </summary>
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Unit>
    {
    private readonly IProductRepository _repository;
    private readonly IDistributedCache _cache;

    public UpdateProductHandler(IProductRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _repository.GetByIdAsync(request.ProductID);
            if (product == null)
            {
                throw new KeyNotFoundException($"Producto con ID {request.ProductID} no encontrado");
            }

            // Actualizar propiedades
            product.ProductName = request.ProductName;
            product.SupplierID = request.SupplierID;
            product.CategoryID = request.CategoryID;
            product.QuantityPerUnit = request.QuantityPerUnit;
            product.UnitPrice = request.UnitPrice;
            product.UnitsInStock = request.UnitsInStock;
            product.UnitsOnOrder = request.UnitsOnOrder;
            product.ReorderLevel = request.ReorderLevel;
            product.Discontinued = request.Discontinued;

            await _repository.UpdateAsync(product);

            // Invalidar caché del detalle
            var cacheKey = $"product:detail:{request.ProductID}";
            await _cache.RemoveAsync(cacheKey, cancellationToken);
            // Bust para listados (incrementar versión)
            var version = await _cache.GetStringAsync("product:list:version", cancellationToken);
            if (!int.TryParse(version, out var v)) v = 0;
            await _cache.SetStringAsync("product:list:version", (v + 1).ToString(), cancellationToken);

            return Unit.Value;
        }
    }
}