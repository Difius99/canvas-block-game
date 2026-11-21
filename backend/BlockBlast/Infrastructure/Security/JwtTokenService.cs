using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BlockBlast.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace BlockBlast.Infrastructure.Security;

public class JwtTokenService
{
    private readonly SigningCredentials _signingCredentials;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtTokenService(SymmetricSecurityKey signingKey, string issuer, string audience)
    {
        _signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        _issuer = issuer;
        _audience = audience;
    }

    public string CreateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: _signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
