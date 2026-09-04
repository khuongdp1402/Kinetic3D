using System;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Infrastructure.Settings;
using Meilisearch;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Kinetic3D.Infrastructure.Services;

public class MeilisearchService : ISearchService
{
    private readonly MeilisearchClient _client;
    private readonly ILogger<MeilisearchService> _logger;

    public MeilisearchService(IOptions<MeilisearchSettings> options, ILogger<MeilisearchService> logger)
    {
        var settings = options.Value;
        _client = new MeilisearchClient(settings.Endpoint, settings.ApiKey);
        _logger = logger;
    }

    public async Task IndexProductAsync(ProductSearchDocument document)
    {
        try
        {
            var index = _client.Index("products");
            await index.AddDocumentsAsync(new[] { document });
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Không thể index sản phẩm {ProductId} vào Meilisearch. Bỏ qua để không chặn thao tác chính.", document.Id);
        }
    }
}
