using Kinetic3D.Domain.Entities;

namespace Kinetic3D.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
