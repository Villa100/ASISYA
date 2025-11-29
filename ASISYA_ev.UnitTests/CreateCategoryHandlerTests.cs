using System.Threading;
using System.Threading.Tasks;
using ASISYA_ev.Application.Categories.Commands;
using ASISYA_ev.Domain.DTOs;
using ASISYA_ev.Domain.Entidades;
using ASISYA_ev.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace ASISYA_ev.UnitTests
{
    public class CreateCategoryHandlerTests
    {
        [Fact]
        public async Task Should_Create_Category_When_Name_Is_Unique()
        {
            var repo = new Mock<ICategoryRepository>();
            repo.Setup(r => r.ExistsByNameAsync("SERVIDORES")).ReturnsAsync(false);
            repo.Setup(r => r.CreateAsync(It.IsAny<Category>()))
                .ReturnsAsync(new Category { CategoryID = 1, CategoryName = "SERVIDORES" });

            var handler = new CreateCategoryHandler(repo.Object);
            var cmd = new CreateCategoryCommand("SERVIDORES", "desc");

            var result = await handler.Handle(cmd, CancellationToken.None);

            result.Should().NotBeNull();
            result!.CategoryID.Should().Be(1);
            result.CategoryName.Should().Be("SERVIDORES");
        }

        [Fact]
        public async Task Should_Fail_When_Name_Already_Exists()
        {
            var repo = new Mock<ICategoryRepository>();
            repo.Setup(r => r.ExistsByNameAsync("SERVIDORES")).ReturnsAsync(true);

            var handler = new CreateCategoryHandler(repo.Object);
            var cmd = new CreateCategoryCommand("SERVIDORES");

            var act = async () => await handler.Handle(cmd, CancellationToken.None);

            await act.Should().ThrowAsync<InvalidOperationException>();
        }
    }
}