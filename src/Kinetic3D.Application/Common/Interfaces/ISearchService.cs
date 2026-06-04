using System.Threading.Tasks;
using Kinetic3D.Domain.Entities;

namespace Kinetic3D.Application.Common.Interfaces;

public interface ISearchService
{
    Task IndexProductAsync(Product product);
}
