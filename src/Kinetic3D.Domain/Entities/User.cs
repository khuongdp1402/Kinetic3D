using System;
using System.Collections.Generic;

namespace Kinetic3D.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string DisplayName { get; set; }
        public string Role { get; set; } = "Customer";
        public int Credits { get; set; } = 0;
        public string? DeviceHash { get; set; }
        public string? GoogleId { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Order> Orders { get; set; }
    }
}
