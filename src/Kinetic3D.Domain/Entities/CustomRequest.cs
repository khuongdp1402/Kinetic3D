using System;
using Kinetic3D.Domain.Enums;

namespace Kinetic3D.Domain.Entities
{
    public class CustomRequest
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string? CustomerEmail { get; set; }
        public string ReferenceImageUrl { get; set; }
        public string? SketchImageUrl { get; set; }
        public string Description { get; set; }
        public CustomRequestStatus Status { get; set; } = CustomRequestStatus.PendingReview;
        public decimal? QuotedPrice { get; set; }
        public string? AdminNote { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
