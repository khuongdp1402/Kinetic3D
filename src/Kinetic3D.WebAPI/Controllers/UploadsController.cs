using System.Threading.Tasks;
using Kinetic3D.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Kinetic3D.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IStorageService _storageService;

    public UploadsController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromBody] PresignedUrlRequest request)
    {
        if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.ContentType))
        {
            return BadRequest("FileName and ContentType are required.");
        }

        var url = await _storageService.GetPresignedUploadUrlAsync(request.FileName, request.ContentType);
        return Ok(new { Url = url });
    }
}

public class PresignedUrlRequest
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
}
