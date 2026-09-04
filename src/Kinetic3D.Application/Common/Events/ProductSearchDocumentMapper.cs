using System.Linq;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Domain.Entities;

namespace Kinetic3D.Application.Common.Events;

public static class ProductSearchDocumentMapper
{
    public static ProductSearchDocument ToSearchDocument(this Product product)
    {
        return new ProductSearchDocument(
            product.Id.ToString(),
            product.Name,
            product.Slug,
            product.ShortDescription,
            product.BasePrice,
            product.Category?.Name,
            product.Images.ToArray());
    }
}
