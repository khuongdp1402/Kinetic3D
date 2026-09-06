using System;

namespace Kinetic3D.Domain.Entities
{
    public class DeviceClaim
    {
        public Guid Id { get; set; }
        public string DeviceHash { get; set; }
        public Guid? UserId { get; set; }
        public DateTime ClaimedAt { get; set; } = DateTime.UtcNow;
        public string? IpAddress { get; set; }
    }
}
