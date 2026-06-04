using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Domain.Entities;
using Meilisearch;
using Microsoft.Extensions.Configuration;

namespace Kinetic3D.Infrastructure.Services;

public class MeilisearchService : ISearchService
{
    private readonly MeilisearchClient _client;

    public MeilisearchService(IConfiguration configuration)
    {
        var settings = configuration.GetSection("MeilisearchSettings");
        var endpoint = settings["Endpoint"];
        var apiKey = settings["ApiKey"];

        _client = new MeilisearchClient(endpoint, apiKey);
    }

    public async Task IndexProductAsync(Product product)
    {
        var index = _client.Index("products");
        await index.AddDocumentsAsync(new[] { product });
    }
}
