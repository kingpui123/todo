using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.IdentityModel.Tokens;


public class JwtValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public JwtValidationMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Headers.ContainsKey("Authorization"))
        {
            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (ValidateToken(token, out ClaimsPrincipal principal))
            {
                context.Items["UserId"] = principal.Claims.FirstOrDefault(x => x.Type == "id").Value;
            }
            else
            {
                context.Response.StatusCode = 401; // Unauthorized
                // context.
                // await context.Response.WriteAsync("Invalid or expired access token.");
                return;
            }
        }
        else
        {
            context.Response.StatusCode = 401; // Unauthorized
            // await context.Response.WriteAsync("Authorization header is missing.");
            return;
        }

        await _next(context);
    }

    private bool ValidateToken(string token, out ClaimsPrincipal principal)
    {
        principal = null;
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],

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