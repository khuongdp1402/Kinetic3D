using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Infrastructure.Persistence;
using Kinetic3D.Infrastructure.Services;
using Kinetic3D.Infrastructure.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Kinetic3D.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(configuration.GetConnectionString("DefaultConnection"));
            dataSourceBuilder.EnableDynamicJson();
            var dataSource = dataSourceBuilder.Build();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    dataSource,
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

            services.Configure<MinioSettings>(configuration.GetSection("MinioSettings"));
            services.Configure<MeilisearchSettings>(configuration.GetSection("MeilisearchSettings"));
            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

            services.AddScoped<IStorageService, MinioStorageService>();
            services.AddScoped<ISearchService, MeilisearchService>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();

            services.AddScoped<ITelegramNotificationService, TelegramNotificationService>();

            return services;
        }
    }
}
