using BlockBlast.Application.Contracts.Auth;
using BlockBlast.Domain.Entities;
using BlockBlast.Infrastructure;
using BlockBlast.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using BlockBlast.Application.Auth.Exceptions;

namespace BlockBlast.Application.Auth;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;

    public AuthService(AppDbContext db, JwtTokenService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task Register(RegisterRequest request)
    {
        var userName = request.UserName.Trim();

        var exists = await _db.Users.AnyAsync(u => u.UserName == userName);
        if (exists)
            throw new UsernameTakenException();

        var user = new User
        {
            UserName = userName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Users.Add(user);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new UsernameTakenException();
        }
    }

    public async Task<AuthResponse> Login(LoginRequest request)
    {
        var userName = request.UserName.Trim();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (user is null)
            throw new InvalidCredentialsException();

        var ok = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!ok)
            throw new InvalidCredentialsException();

        var token = _jwt.CreateAccessToken(user);
        return new AuthResponse(token);
    }
}