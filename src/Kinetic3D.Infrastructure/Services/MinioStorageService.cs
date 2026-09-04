using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Kinetic3D.Application.Common.Interfaces;
using Kinetic3D.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace Kinetic3D.Infrastructure.Services;

public class MinioStorageService : IStorageService
{
    private readonly AmazonS3Client _s3Client;
    private readonly string _bucketName;
    private readonly string _publicEndpoint;

    public MinioStorageService(IOptions<MinioSettings> options)
    {
        var minioSettings = options.Value;
        _bucketName = minioSettings.BucketName;
        _publicEndpoint = string.IsNullOrWhiteSpace(minioSettings.PublicEndpoint)
            ? minioSettings.Endpoint
            : minioSettings.PublicEndpoint;

        // Presigned URLs are signed against the endpoint the browser will actually call
        // (not the Docker-internal endpoint), since SigV4 includes the Host header.
        var config = new AmazonS3Config
        {
            ServiceURL = $"http://{_publicEndpoint}",
            ForcePathStyle = true,
            UseHttp = true
        };

        _s3Client = new AmazonS3Client(minioSettings.AccessKey, minioSettings.SecretKey, config);
    }

    public Task<PresignedUploadResult> GetPresignedUploadUrlAsync(string folder, string fileName, string contentType)
    {
        var sanitizedFileName = Regex.Replace(fileName, @"[^a-zA-Z0-9._-]", "-");
        var uniquePrefix = Guid.NewGuid().ToString("N")[..8];
        var objectKey = $"{folder.Trim('/')}/{uniquePrefix}-{sanitizedFileName}";

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(15),
            ContentType = contentType
        };

        string uploadUrl = _s3Client.GetPreSignedURL(request).Replace("https://", "http://");
        string publicUrl = $"http://{_publicEndpoint}/{_bucketName}/{objectKey}";

        return Task.FromResult(new PresignedUploadResult(uploadUrl, publicUrl, objectKey));
    }
}
