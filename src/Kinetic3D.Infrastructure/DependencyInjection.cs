using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Infrastructure.Persistence;
using Kinetic3D.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Kinetic3D.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddScoped<IStorageService, MinioStorageService>();
            services.AddScoped<ISearchService, MeilisearchService>();

            return services;
        }
    }
}
