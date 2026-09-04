using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using MediatR;

namespace Kinetic3D.Application.Common.Events;

public class ProductUpdatedEventHandler : INotificationHandler<ProductUpdatedEvent>
{
    private readonly ISearchService _searchService;

    public ProductUpdatedEventHandler(ISearchService searchService)
    {
        _searchService = searchService;
    }

    public async Task Handle(ProductUpdatedEvent notification, CancellationToken cancellationToken)
    {
        await _searchService.IndexProductAsync(notification.Product.ToSearchDocument());
    }
}
