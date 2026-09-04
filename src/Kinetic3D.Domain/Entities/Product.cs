using System;
using System.Collections.Generic;

namespace Kinetic3D.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public string? ShortDescription { get; set; }
        public decimal BasePrice { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> Images { get; set; } = new List<string>();
        public string? Model3DUrl { get; set; }
        public Dictionary<string, string> Specs { get; set; } = new Dictionary<string, string>();
        public List<string> Colors { get; set; } = new List<string>();
        public List<string> Sizes { get; set; } = new List<string>();
        public bool Featured { get; set; } = false;
        public bool InStock { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public ICollection<ProductVariant>? Variants { get; set; }
    }
}
