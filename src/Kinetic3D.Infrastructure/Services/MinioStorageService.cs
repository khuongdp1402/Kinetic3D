using System;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Kinetic3D.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Kinetic3D.Infrastructure.Services;

public class MinioStorageService : IStorageService
{
    private readonly AmazonS3Client _s3Client;
    private readonly string _bucketName;

    public MinioStorageService(IConfiguration configuration)
    {
        var minioSettings = configuration.GetSection("MinioSettings");
        var accessKey = minioSettings["AccessKey"];
        var secretKey = minioSettings["SecretKey"];
        var endpoint = minioSettings["Endpoint"];
        _bucketName = minioSettings["BucketName"] ?? "kinetic3d-assets";

        var config = new AmazonS3Config
        {
            ServiceURL = $"http://{endpoint}",
            ForcePathStyle = true
        };

        _s3Client = new AmazonS3Client(accessKey, secretKey, config);
    }

    public Task<string> GetPresignedUploadUrlAsync(string fileName, string contentType)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(15),
            ContentType = contentType
        };

        string url = _s3Client.GetPreSignedURL(request);
        return Task.FromResult(url);
    }
}
