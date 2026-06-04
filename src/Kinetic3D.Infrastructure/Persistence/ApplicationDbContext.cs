using Kinetic3D.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProductVariant>()
                .Property(v => v.Attributes)
                .HasColumnType("jsonb");

            modelBuilder.Entity<OrderItem>()
                .Property(o => o.Custom3DConfig)
                .HasColumnType("jsonb");
        }
    }
}
