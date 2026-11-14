using System.ComponentModel.DataAnnotations;

namespace BlockBlast.Contracts
{
    public record RegisterRequest(
        [Required(ErrorMessage = "Введите имя")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Имя должно быть от 3 до 20 символов")]
        [RegularExpression("^[a-zA-Z0-9_]+$", ErrorMessage = "Имя может содержать только латиницу, цифры и _")]
        string Username,

        [Required(ErrorMessage = "Введите пароль")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль должен быть не короче 6 символов")]
        string Password);

    public record LoginRequest(
        [Required(ErrorMessage = "Введите имя")] string Username,
        [Required(ErrorMessage = "Введите пароль")] string Password);

    public record UserResponse(string Username, int BestScore);

    public record AuthResponse(string Token, UserResponse User);

    public record ErrorResponse(string Message);
}
