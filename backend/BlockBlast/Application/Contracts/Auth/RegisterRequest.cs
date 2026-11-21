using System.ComponentModel.DataAnnotations;

namespace BlockBlast.Application.Contracts.Auth;

public record RegisterRequest(
    [Required]
    [StringLength(20, MinimumLength = 3)]
    [RegularExpression("^[a-zA-Z0-9_]+$")]
    string Username,
    [Required]
    [StringLength(100, MinimumLength = 6)]
    string Password);
