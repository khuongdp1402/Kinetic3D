using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductVariant> ProductVariants { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<User> Users { get; }
    DbSet<CustomRequest> CustomRequests { get; }
    DbSet<DeviceClaim> DeviceClaims { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
