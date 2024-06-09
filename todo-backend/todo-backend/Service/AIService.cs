
using System.Text;
using Newtonsoft.Json;

public class AIService
{
    private static readonly string apiUrl = "https://api.openai.com/v1/chat/completions";
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public AIService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<string?> GenerateTodo(string description)
    {
        string apiKey = _configuration.GetValue<string>("OpenAI:ApiKey") ?? "";
        var httpClient = _httpClientFactory.CreateClient();
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        string prompt = $"write me with for a todo list item according to \"{description}\" in json format only, with the following fields: name, description, priority, tags, importance. please give priority in integer format, 3 meaning the highest priority and 1 meaning the lowest priority. please give importance in integer format, 3 meaning the most important and 1 meaning the least important";
        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = new[] {
                    new { role = "user", content = prompt }
                }
        };

        var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync(apiUrl, content);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        dynamic? jsonResponse = JsonConvert.DeserializeObject(responseContent);
        return jsonResponse?.choices?[0]?.message?.content?.ToString() ?? "";

    }
}