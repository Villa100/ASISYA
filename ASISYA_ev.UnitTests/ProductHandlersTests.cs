using System.Threading;
using System.Threading.Tasks;
using ASISYA_ev.Application.Products.Commands;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Entidades;
using ASISYA_ev.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace ASISYA_ev.UnitTests
{
    public class ProductHandlersTests
    {
        [Fact]
        public async Task UpdateProduct_Should_Update_All_Fields()
        {
            var repo = new Mock<IProductRepository>();
            repo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Product { ProductID = 1 });

                var handler = new UpdateProductHandler(repo.Object, new Moq.Mock<Microsoft.Extensions.Caching.Distributed.IDistributedCache>().Object);
            var cmd = new UpdateProductCommand(1, "Prod", 3, 2, null, 0m, 0, 0, 0, false);

            await handler.Handle(cmd, CancellationToken.None);
            repo.Verify(r => r.UpdateAsync(It.Is<Product>(p => p.ProductID == 1 && p.ProductName == "Prod" && p.CategoryID == 2 && p.SupplierID == 3)), Times.Once);
        }

        [Fact]
        public async Task DeleteProduct_Should_Remove_When_Exists()
        {
            var repo = new Mock<IProductRepository>();
            repo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Product { ProductID = 1 });

                var handler = new DeleteProductHandler(repo.Object, new Moq.Mock<Microsoft.Extensions.Caching.Distributed.IDistributedCache>().Object);
            var cmd = new DeleteProductCommand(1);

            await handler.Handle(cmd, CancellationToken.None);
            repo.Verify(r => r.DeleteAsync(1), Times.Once);
        }
    }
}