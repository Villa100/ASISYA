using Microsoft.AspNetCore.Mvc;
using MediatR;
using ASISYA_ev.Application.Categories.Commands;
using ASISYA_ev.Application.Categories.Queries;
using ASISYA_ev.Domain.DTOs;

namespace ASISYA_ev.Api.Controllers
{
    /// <summary>
    /// Controlador para operaciones CRUD de categorías.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ISender _mediator;

        public CategoryController(ISender mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Obtiene todas las categorías.
        /// </summary>
        /// <returns>Lista de categorías</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CategoryDto>>> GetAll()
        {
            var query = new GetCategoriesQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Obtiene una categoría por ID.
        /// </summary>
        /// <param name="id">ID de la categoría</param>
        /// <returns>Categoría encontrada</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoryDto>> GetById(int id)
        {
            var query = new GetCategoryByIdQuery(id);
            var result = await _mediator.Send(query);

            if (result == null)
                return NotFound(new { message = $"Categoría con ID {id} no encontrada" });

            return Ok(result);
        }

        /// <summary>
        /// Crea una nueva categoría.
        /// </summary>
        /// <param name="dto">Datos de la categoría</param>
        /// <returns>Categoría creada</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CategoryDto>> Create([FromBody] CategoryCreateDto dto)
        {
            try
            {
                var command = new CreateCategoryCommand(dto.CategoryName, dto.Description);
                var result = await _mediator.Send(command);

                return CreatedAtAction(nameof(GetById), new { id = result.CategoryID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Actualiza una categoría existente.
        /// </summary>
        /// <param name="id">ID de la categoría</param>
        /// <param name="dto">Datos actualizados</param>
        /// <returns>NoContent si fue exitoso</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryUpdateDto dto)
        {
            if (id != dto.CategoryID)
                return BadRequest(new { message = "El ID de la ruta no coincide con el ID del cuerpo" });

            try
            {
                var command = new UpdateCategoryCommand(dto.CategoryID, dto.CategoryName, dto.Description);
                await _mediator.Send(command);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Elimina una categoría.
        /// </summary>
        /// <param name="id">ID de la categoría</param>
        /// <returns>NoContent si fue exitoso</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var command = new DeleteCategoryCommand(id);
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