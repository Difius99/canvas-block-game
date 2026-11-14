using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace BlockBlast.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetUserId(this ClaimsPrincipal principal)
        {
            var value = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return int.TryParse(value, out var id) ? id : null;
        }
    }
}
