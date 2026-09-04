using System.Linq;
using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private static readonly string[] AllowedImageContentTypes = { "image/webp", "image/jpeg", "image/png" };
    private static readonly string[] AllowedModelContentTypes = { "model/gltf-binary", "application/octet-stream" };

    private readonly IStorageService _storageService;

    public UploadsController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromBody] PresignedUrlRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FileName) || string.IsNullOrWhiteSpace(request.ContentType))
        {
            return BadRequest("FileName và ContentType là bắt buộc.");
        }

        if (string.IsNullOrWhiteSpace(request.Folder))
        {
            return BadRequest("Folder là bắt buộc, ví dụ: products/{id}/images.");
        }

        var isAllowedImage = AllowedImageContentTypes.Contains(request.ContentType);
        var isAllowedModel = AllowedModelContentTypes.Contains(request.ContentType);
        if (!isAllowedImage && !isAllowedModel)
        {
            return BadRequest($"Loại file '{request.ContentType}' không được hỗ trợ.");
        }

        var result = await _storageService.GetPresignedUploadUrlAsync(request.Folder, request.FileName, request.ContentType);
        return Ok(new { uploadUrl = result.UploadUrl, publicUrl = result.PublicUrl });
    }
}

public class PresignedUrlRequest
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Folder { get; set; } = string.Empty;
}
