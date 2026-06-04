using System;
using System.Collections.Generic;

namespace Kinetic3D.Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public Dictionary<string, string> Custom3DConfig { get; set; } = new Dictionary<string, string>();
    }
}
