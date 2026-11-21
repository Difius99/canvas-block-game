using System.ComponentModel.DataAnnotations;

namespace BlockBlast.Application.Contracts.Auth;

public record LoginRequest([Required] string Username, [Required] string Password);
