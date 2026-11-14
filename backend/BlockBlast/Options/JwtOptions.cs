namespace BlockBlast.Options
{
    public class JwtOptions
    {
        public const string SectionName = "Jwt";

        public string Issuer { get; set; } = string.Empty;

        public string Audience { get; set; } = string.Empty;

        // секрет для подписи токенов, минимум 32 байта
        public string Key { get; set; } = string.Empty;

        public int LifetimeDays { get; set; } = 7;
    }
}
