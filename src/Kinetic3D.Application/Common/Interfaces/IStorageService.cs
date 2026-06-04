using System.Threading.Tasks;

namespace Kinetic3D.Application.Common.Interfaces;

public interface IStorageService
{
    Task<string> GetPresignedUploadUrlAsync(string fileName, string contentType);
}
