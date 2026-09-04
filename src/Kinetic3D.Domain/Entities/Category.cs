using System;
using System.Collections.Generic;

namespace Kinetic3D.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string? Image { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<Product>? Products { get; set; }
    }
}
