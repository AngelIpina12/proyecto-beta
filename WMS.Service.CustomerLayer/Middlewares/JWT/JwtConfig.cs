namespace WMS.Service.CustomerLayer.Middlewares.JWT
{
	public class JwtConfig
	{
		public string Secret { get; set; } = null!;
	}

	public interface ITokenParameters
	{
		int? Id { get; set; }
		string UserId { get; set; }
		string Email { get; set; }
		string FirstName { get; set; }
		string LastName { get; set; }
		string WarehouseName { get; set; }
	}

	public class TokenParameters : ITokenParameters
	{
		public int? Id { get; set; }
		public string UserId { get; set; } = null!;
		public string Email { get; set; } = string.Empty;
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string WarehouseName { get; set; } = string.Empty;
		public string CustomerId { get; set; } = string.Empty;

    }
}
