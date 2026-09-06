using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kinetic3D.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CustomRequest> CustomRequests { get; set; }
        public DbSet<DeviceClaim> DeviceClaims { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .Property(p => p.Images)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Product>()
                .Property(p => p.Specs)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Product>()
                .Property(p => p.Colors)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Product>()
                .Property(p => p.Sizes)
                .HasColumnType("jsonb");

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Slug)
                .IsUnique();

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Slug)
                .IsUnique();

            modelBuilder.Entity<ProductVariant>()
                .Property(v => v.Attributes)
                .HasColumnType("jsonb");

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.OrderNumber)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .Property(o => o.Custom3DConfig)
                .HasColumnType("jsonb");

            modelBuilder.Entity<CustomRequest>()
                .Property(c => c.Status)
                .HasConversion<string>();
        }
    }
}
