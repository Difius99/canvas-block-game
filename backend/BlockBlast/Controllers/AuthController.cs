using BlockBlast.Contracts;
using BlockBlast.Data;
using BlockBlast.Extensions;
using BlockBlast.Models;
using BlockBlast.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlockBlast.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher<User> _hasher;
        private readonly TokenService _tokens;

        public AuthController(AppDbContext db, IPasswordHasher<User> hasher, TokenService tokens)
        {
            _db = db;
            _hasher = hasher;
            _tokens = tokens;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            var normalized = request.Username.ToUpperInvariant();
            if (await _db.Users.AnyAsync(u => u.NormalizedUsername == normalized))
            {
                return Conflict(new ErrorResponse("Это имя уже занято"));
            }

            var user = new User
            {
                Username = request.Username,
                NormalizedUsername = normalized,
                CreatedAt = DateTime.UtcNow,
            };
            user.PasswordHash = _hasher.HashPassword(user, request.Password);

            _db.Users.Add(user);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // два одновременных запроса с одним именем — сработал уникальный индекс
                return Conflict(new ErrorResponse("Это имя уже занято"));
            }

            return Ok(CreateAuthResponse(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var normalized = request.Username.ToUpperInvariant();
            var user = await _db.Users.SingleOrDefaultAsync(u => u.NormalizedUsername == normalized);
            if (user is null)
            {
                return Unauthorized(new ErrorResponse("Неверное имя или пароль"));
            }

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new ErrorResponse("Неверное имя или пароль"));
            }

            if (result == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.PasswordHash = _hasher.HashPassword(user, request.Password);
                await _db.SaveChangesAsync();
            }

            return Ok(CreateAuthResponse(user));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserResponse>> Me()
        {
            var user = await _db.Users.FindAsync(User.GetUserId());
            if (user is null)
            {
                return Unauthorized(new ErrorResponse("Пользователь не найден"));
            }

            return Ok(new UserResponse(user.Username, user.BestScore));
        }

        private AuthResponse CreateAuthResponse(User user)
        {
            return new AuthResponse(_tokens.CreateToken(user), new UserResponse(user.Username, user.BestScore));
        }
    }
}
