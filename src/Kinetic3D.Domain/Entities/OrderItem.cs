using System;
using System.Collections.Generic;

namespace Kinetic3D.Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string? VariantAttributesSnapshot { get; set; }
        public string? CustomText { get; set; }
        public Dictionary<string, string> Custom3DConfig { get; set; } = new Dictionary<string, string>();
    }
}
