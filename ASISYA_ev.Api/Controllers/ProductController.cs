using Microsoft.AspNetCore.Mvc;
using MediatR;
using ASISYA_ev.Infrastructure.Data;
using ASISYA_ev.Application.Products.Commands;
using ASISYA_ev.Application.Products.Queries;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class ProductController : ControllerBase
    {
        private readonly ISender _mediator;

        public ProductController(ISender mediator)
        {
            _mediator = mediator;
        }

        // POST /api/Product/ (Carga Masiva)
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // [Authorize(Roles = "Admin")] // Aplicación de seguridad JWT
        public async Task<IActionResult> PostProductsBatch([FromBody] ProductBatchCreationDto dto)
        {
            var command = new CreateProductsBatchCommand(dto.Products);
            await _mediator.Send(command);
            
            // Retorna 202 Accepted, indicando que la petición ha sido aceptada para procesamiento
            return Accepted();
        }

        // GET /api/Product/ (Consulta Avanzada: Paginación, Filtros, Búsqueda)
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedList<ProductListDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? filter = null,
            [FromQuery] string? search = null)
        {
            var query = new GetProductsQuery(pageNumber, pageSize, filter, search);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET /api/Product/{id} (Detalle)
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ProductDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductDetail(int id)
        {
            var query = new GetProductDetailQuery(id);
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Actualiza un producto existente.
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <param name="dto">Datos actualizados</param>
        /// <returns>NoContent si fue exitoso</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto dto)
        {
            if (id != dto.ProductID)
                return BadRequest(new { message = "El ID de la ruta no coincide con el ID del cuerpo" });

            try
            {
                var command = new UpdateProductCommand(
                    dto.ProductID,
                    dto.ProductName,
                    dto.SupplierID,
                    dto.CategoryID,
                    dto.QuantityPerUnit,
                    dto.UnitPrice,
                    dto.UnitsInStock,
                    dto.UnitsOnOrder,
                    dto.ReorderLevel,
                    dto.Discontinued
                );
                await _mediator.Send(command);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Elimina un producto.
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <returns>NoContent si fue exitoso</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var command = new DeleteProductCommand(id);
                await _mediator.Send(command);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}