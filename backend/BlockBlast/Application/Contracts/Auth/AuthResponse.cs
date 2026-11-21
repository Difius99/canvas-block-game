namespace BlockBlast.Application.Contracts.Auth;

public record AuthResponse(string Token, UserResponse User);

public record UserResponse(string Username, int BestScore);
