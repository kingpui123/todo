using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


public class GoogleAuthHelper
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public GoogleAuthHelper(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }


    public async Task<(string AccessToken, string RefreshToken)> GetTokensFromAuthorizationCodeAsync(string authorizationCode)
    {
        var httpClient = _httpClientFactory.CreateClient();
        string clientId = Environment.GetEnvironmentVariable("google.client.id");
        string clientSecret = Environment.GetEnvironmentVariable("google.client.secret");
        string redirectUri = Environment.GetEnvironmentVariable("google.redirect.uri");    

        var requestBody = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("code", authorizationCode),
            new KeyValuePair<string, string>("client_id", clientId),
            new KeyValuePair<string, string>("client_secret", clientSecret),
            new KeyValuePair<string, string>("redirect_uri", redirectUri),
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
        });

        var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", requestBody);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        var jsonResponse = JObject.Parse(responseContent);

        var accessToken = jsonResponse["access_token"]?.ToString();
        var refreshToken = jsonResponse["refresh_token"]?.ToString();

        return (accessToken, refreshToken);
    }

    public async Task<GoogleUser> GetGoogleUserAsync(string accessToken) {
         var httpClient = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v1/userinfo?alt=json");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var response = await httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        GoogleUser user = JsonConvert.DeserializeObject<GoogleUser>(responseContent);
    
        return user;
    }

    public bool ValidateToken(string token, out ClaimsPrincipal principal)
    {
        principal = null;
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("jwt.secret.key"));

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = Environment.GetEnvironmentVariable("jwt.issuer"),

            ValidateAudience = true,
            ValidAudience = Environment.GetEnvironmentVariable("jwt.audience"),

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),

            ClockSkew = TimeSpan.Zero // Disable clock skew for testing purposes
        };

        try
        {
            principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

            // Additional validation to check token algorithm
            if (validatedToken is JwtSecurityToken jwtToken &&
                jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return true;
            }
            else
            {
                throw new SecurityTokenException("Invalid token algorithm");
            }
        }
        catch (Exception ex)
        {
            // Log or handle validation failure
            return false;
        }
    }

}

public class GoogleUser {
    public string Id { get; set; }
    public string Email { get; set; }
    public bool VerifiedEmail { get; set; }
    public string Name { get; set; }
    public string GivenName { get; set; }

    public string FamilyName { get; set; }
    public string Picture { get; set; }
}