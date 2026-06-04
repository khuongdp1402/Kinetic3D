using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using MediatR;

namespace Kinetic3D.Application.Common.Events;

public class ProductCreatedEventHandler : INotificationHandler<ProductCreatedEvent>
{
    private readonly ISearchService _searchService;

    public ProductCreatedEventHandler(ISearchService searchService)
    {
        _searchService = searchService;
    }

    public async Task Handle(ProductCreatedEvent notification, CancellationToken cancellationToken)
    {
        await _searchService.IndexProductAsync(notification.Product);
    }
}
