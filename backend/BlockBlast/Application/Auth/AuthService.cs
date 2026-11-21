using BlockBlast.Application.Auth.Exceptions;
using BlockBlast.Application.Contracts.Auth;
using BlockBlast.Domain.Entities;
using BlockBlast.Infrastructure;
using BlockBlast.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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

    public async Task<AuthResponse> Register(RegisterRequest request)
    {
        var userName = request.Username.Trim();
        if (await _db.Users.AnyAsync(user => user.UserName == userName))
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
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.UniqueViolation, ConstraintName: "IX_Users_UserName" })
        {
            throw new UsernameTakenException();
        }

        return new AuthResponse(_jwt.CreateAccessToken(user), new UserResponse(user.UserName, 0));
    }

    public async Task<AuthResponse> Login(LoginRequest request)
    {
        var userName = request.Username.Trim();
        var user = await _db.Users.FirstOrDefaultAsync(user => user.UserName == userName);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new InvalidCredentialsException();

        var profile = await GetProfile(user.Id);
        if (profile is null)
            throw new InvalidCredentialsException();

        return new AuthResponse(_jwt.CreateAccessToken(user), profile);
    }

    public Task<UserResponse?> GetProfile(int userId) =>
        _db.Users.AsNoTracking()
            .Where(user => user.Id == userId)
            .Select(user => new UserResponse(
                user.UserName,
                user.Scores.Max(score => (int?)score.Value) ?? 0))
            .SingleOrDefaultAsync();
}
