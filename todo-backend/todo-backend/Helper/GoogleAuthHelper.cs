using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


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
        string clientId = _configuration.GetSection("Authentication:Google").GetValue<string>("ClientId");
        string clientSecret = _configuration.GetSection("Authentication:Google").GetValue<string>("ClientSecret");
        string redirectUri = _configuration.GetSection("Authentication:Google").GetValue<string>("RedirectUri");    

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