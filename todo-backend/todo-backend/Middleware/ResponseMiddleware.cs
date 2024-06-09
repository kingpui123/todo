using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.IO;
using System.Threading.Tasks;

public class ResponseMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ResponseMiddleware> _logger;

    public ResponseMiddleware(RequestDelegate next, ILogger<ResponseMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var originalBodyStream = context.Response.Body;

        using (var responseBodyStream = new MemoryStream())
        {
            context.Response.Body = responseBodyStream;

            await _next(context);

            context.Response.Body.Seek(0, SeekOrigin.Begin);
            var responseBody = await new StreamReader(context.Response.Body).ReadToEndAsync();
            context.Response.Body.Seek(0, SeekOrigin.Begin);

            var standardizedResponse = new
            {
                status = context.Response.StatusCode,
                message = GetMessageForStatusCode(context.Response.StatusCode),
                data = JsonConvert.DeserializeObject(responseBody)
            };

            var standardizedResponseBody = JsonConvert.SerializeObject(standardizedResponse);

            context.Response.ContentType = "application/json";
            context.Response.Body = originalBodyStream;
            await context.Response.WriteAsync(standardizedResponseBody);
        }
    }

    private string GetMessageForStatusCode(int statusCode)
    {
        return statusCode switch
        {
            StatusCodes.Status200OK => "Success",
            StatusCodes.Status400BadRequest => "Bad Request",
            StatusCodes.Status404NotFound => "Not Found",
            StatusCodes.Status500InternalServerError => "Internal Server Error",
            _ => "Unknown Status"
        };
    }
}