using Kinetic3D.Domain.Entities;
using MediatR;

namespace Kinetic3D.Application.Common.Events;

public class ProductUpdatedEvent : INotification
{
    public Product Product { get; }

    public ProductUpdatedEvent(Product product)
    {
        Product = product;
    }
}
