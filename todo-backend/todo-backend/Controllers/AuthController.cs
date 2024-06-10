using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

using TodoApi.Models;

[Route("[controller]/[action]")]
[ApiController]
[EnableCors("AllowSpecificOrigin")]
public class AuthController : ControllerBase
{
    private readonly GoogleAuthHelper _googleAuthHelper;
    private readonly UserContext _context;

     private readonly TokenService _tokenService;

    public AuthController(GoogleAuthHelper googleAuthHelper, UserContext context, TokenService tokenService)
    {
        _googleAuthHelper = googleAuthHelper;
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {

        var (accessToken, refreshToken) = await _googleAuthHelper.GetTokensFromAuthorizationCodeAsync(req.AuthorizationCode);
       
        GoogleUser googleUser = await _googleAuthHelper.GetGoogleUserAsync(accessToken);

        var user = await _context.Users.FindAsync(googleUser.Id);

        // if first time login, create user
        if (user == null)
        {
            user = new User
            {
                Id = googleUser.Id,
                Email = googleUser.Email,
                UserName = googleUser.Name,
                FamilyName = googleUser.FamilyName,
                GivenName = googleUser.GivenName,
                Picture = googleUser.Picture,
                RefreshToken = refreshToken,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        } else {
            // logged in before, update refresh token
           await _context.Users.Where(u => u.Id == user.Id).ExecuteUpdateAsync(
            b => b.SetProperty(u => u.RefreshToken, refreshToken)
           );
        }

        string token = _tokenService.GenerateToken(user);
        
        return Ok(new {  
            token,
            user
        });
    }

    [HttpPost] 
    public async Task<IActionResult> VerifyToken() {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        if (_googleAuthHelper.ValidateToken(token, out ClaimsPrincipal principal)) {
            string userId = principal?.Claims?.FirstOrDefault(x => x.Type == "id")?.Value;
            User user = await _context.Users.FindAsync(userId);
            if (user == null) {
                return Unauthorized("no such user");
            }

            return Ok(user);
        } else {
            return Unauthorized();
        }

    }

    [HttpPost]
    public async Task<IActionResult> ExchangeAuthorizationCode([FromBody] AuthorizationCodeRequest authorizationCodeRequest)
    {
        if (string.IsNullOrEmpty(authorizationCodeRequest.AuthorizationCode))
        {
            return BadRequest("Authorization code is required.");
        }
        var (accessToken, refreshToken) = await _googleAuthHelper.GetTokensFromAuthorizationCodeAsync(
            authorizationCodeRequest.AuthorizationCode
        );

        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest("Failed to obtain tokens.");
        }

        return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });
    }


}

public class LoginRequest
{
    public string AuthorizationCode { get; set; }
}

public class AuthorizationCodeRequest
{
    public string AuthorizationCode { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
    public string RedirectUri { get; set; }
}

