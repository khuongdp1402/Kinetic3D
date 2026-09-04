using System.Threading.Tasks;

namespace Kinetic3D.Application.Common.Interfaces;

/// <param name="UploadUrl">Presigned URL để client PUT file trực tiếp lên MinIO.</param>
/// <param name="PublicUrl">URL công khai để đọc lại file sau khi upload xong.</param>
/// <param name="ObjectKey">Đường dẫn đầy đủ của object trong bucket (folder/filename).</param>
public record PresignedUploadResult(string UploadUrl, string PublicUrl, string ObjectKey);

public interface IStorageService
{
    /// <param name="folder">Ví dụ: "products/{productId}/images", "custom-requests/{requestId}".</param>
    /// <param name="fileName">Tên file gốc, sẽ được làm sạch và thêm tiền tố duy nhất.</param>
    Task<PresignedUploadResult> GetPresignedUploadUrlAsync(string folder, string fileName, string contentType);
}
