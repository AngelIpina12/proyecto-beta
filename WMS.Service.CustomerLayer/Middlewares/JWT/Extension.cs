using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPILayer.Middlewares.JWT;

namespace WMS.Service.CustomerLayer.Middlewares.JWT
{
	public static class Extension
	{
		public static IServiceCollection AddJwt(this IServiceCollection services, IConfiguration configuration)
		{
			services.Configure<JwtConfig>(configuration.GetSection("JwtConfig"));

			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(jwt =>
			 {
				 var key = Encoding.ASCII.GetBytes(configuration["JwtConfig:Secret"]
					 ?? throw new ArgumentException("JWT Key not found")
				 );

				 jwt.SaveToken = true;
				 jwt.TokenValidationParameters = new TokenValidationParameters
				 {
					 ValidateIssuerSigningKey = true,
					 IssuerSigningKey = new SymmetricSecurityKey(key),
					 ValidateIssuer = false,
					 ValidateAudience = false,
					 RequireExpirationTime = true,
					 ValidateLifetime = true
				 };
			 });

			services.AddScoped(typeof(ITokenHandlerService), typeof(TokenHandlerService));

			return services;
		}
	}
}
