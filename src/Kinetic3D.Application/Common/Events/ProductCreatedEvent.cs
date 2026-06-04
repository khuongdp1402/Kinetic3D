using Kinetic3D.Domain.Entities;
using MediatR;

namespace Kinetic3D.Application.Common.Events;

public class ProductCreatedEvent : INotification
{
    public Product Product { get; }

    public ProductCreatedEvent(Product product)
    {
        Product = product;
    }
}
