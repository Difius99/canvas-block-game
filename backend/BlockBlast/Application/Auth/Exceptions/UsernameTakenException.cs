namespace BlockBlast.Application.Auth.Exceptions;

public class UsernameTakenException : Exception
{
    public UsernameTakenException() : base("Username already taken") { }
}