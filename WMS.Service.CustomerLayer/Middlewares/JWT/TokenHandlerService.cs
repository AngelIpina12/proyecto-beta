using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WMS.Service.CustomerLayer.Middlewares.JWT;

namespace WebAPILayer.Middlewares.JWT
{
	public interface ITokenHandlerService
	{
		string GenerateJwtToken(ITokenParameters parameters);
	}

	public class TokenHandlerService : ITokenHandlerService
	{
		private readonly JwtConfig _jwtConfig;

		public TokenHandlerService(IOptionsMonitor<JwtConfig> optionsMonitor)
		{
			_jwtConfig = optionsMonitor.CurrentValue;
		}

		public string GenerateJwtToken(ITokenParameters parameters)
		{
			var jwtTokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);
			var exp = DateTime.UtcNow.AddMonths(1);
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.NameIdentifier, parameters.Id.ToString()),
					new Claim("userid", parameters.UserId),
					new Claim(ClaimTypes.Email, parameters.Email),
					new Claim("firstname", parameters.FirstName),
					new Claim("lastname", parameters.LastName),
					new Claim("warehousename", parameters.WarehouseName),

					new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
				}),
				Expires = exp,
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
			};

			var token = jwtTokenHandler.CreateToken(tokenDescriptor);
			var jwtToken = jwtTokenHandler.WriteToken(token);

			return jwtToken;
		}
	}
}
