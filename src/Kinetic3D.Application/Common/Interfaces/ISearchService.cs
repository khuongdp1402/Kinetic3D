using System.Threading.Tasks;

namespace Kinetic3D.Application.Common.Interfaces;

public record ProductSearchDocument(
    string Id,
    string Name,
    string Slug,
    string? ShortDescription,
    decimal BasePrice,
    string? CategoryName,
    string[] Images);

public interface ISearchService
{
    Task IndexProductAsync(ProductSearchDocument document);
}
