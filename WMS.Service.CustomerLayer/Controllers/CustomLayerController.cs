using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using WebAPILayer.Middlewares.JWT;
using WebAPILayer.Viewmodel;
using WMS.Service.CustomerLayer.Business.Objects.Req;
using WMS.Service.CustomerLayer.Constants;
using WMS.Service.CustomerLayer.Middlewares.JWT;
using WMS.Service.CustomerLayer.Viewmodel;

namespace WebAPILayer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomLayerController : ControllerBase
	{
		private readonly ITokenHandlerService _tokenHandlerService;

		public CustomLayerController(ITokenHandlerService tokenHandlerService)
		{
			_tokenHandlerService = tokenHandlerService;
		}

		[HttpPost("[action]")]
		public async Task<IActionResult> ValidateSingleUser([FromBody] singleUserData asingleData)

		{
			var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();


			var url = configuration["wms:log"];
			UserViewModel datauserb = new UserViewModel();
			BUserViewModel ldatainforigin = new BUserViewModel();

			datauserb.UserId = asingleData.userid;
			datauserb.PWD = asingleData.password;


			string myJson = System.Text.Json.JsonSerializer.Serialize(datauserb);

			var client = new HttpClient();
			var reponse = await client.PostAsync(url, new StringContent(myJson, Encoding.UTF8, "application/json"));
			var resp = await reponse.Content.ReadAsStringAsync();
			var userdata = JsonConvert.DeserializeObject<BUserViewModel>(resp);

			if (userdata == null)
			{
				return BadRequest("Invalid user");
			}

			var token = _tokenHandlerService.GenerateJwtToken(new TokenParameters
			{
				Id = userdata.Id,
				UserId = userdata.UserId,
				Email = userdata.Email,
				FirstName = userdata.FirstName,
				LastName = userdata.LastName,
				WarehouseName = userdata.WarehouseName,
                CustomerId = userdata.PartyRoleId.ToString()
            });

			return Ok(token);
		}


        [HttpPost("[action]")]
        public async Task<IActionResult> SaveExternalRequirement([FromBody] ReqAdd reqAdd)
        {
            try
            {
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();

                var url = configuration["wms:saveExternalRequirement"];

                string myJson = System.Text.Json.JsonSerializer.Serialize(reqAdd);

                using var client = new HttpClient();
                var response = await client.PostAsync(
                    url,
                    new StringContent(myJson, Encoding.UTF8, "application/json"));

                if (response.IsSuccessStatusCode)
                {
                    var respContent = await response.Content.ReadAsStringAsync();

                    if (int.TryParse(respContent, out int respInt) && respInt > 0)
                    {
                        return Ok(new { success = true, message = "Requerimiento guardado exitosamente." });
                    }
                    else
                    {
                        return BadRequest(new { success = false, message = "Ha ocurrido un error al guardar el requerimiento. Vuelve a intentarlo." });
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return BadRequest(new { success = false, message = $"Error al guardar el requerimiento: {errorContent}" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Ocurrió un error interno: {ex.Message}" });
            }
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> GetProductDetails([FromBody] List<ProductDetailsObjectFilter> objectFilters)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var urlTemplate = configuration["wms:getProductDetails"];
            var client = new HttpClient();
            var results = new List<ProductDetailViewModel>();

            foreach (var objectFilter in objectFilters)
            {
                var url = urlTemplate
                    .Replace("(productName)", objectFilter.sku)
                    .Replace("(customerId)", objectFilter.customerId);

                var response = await client.GetAsync(url);
                var resp = await response.Content.ReadAsStringAsync();
                var userdata = JsonConvert.DeserializeObject<ProductDetailViewModel>(resp);

                if (userdata != null)
                {
                    results.Add(userdata);
                }
            }

            if (results.Count == 0)
            {
                return BadRequest("No valid users found");
            }

            return Ok(results);
        }



        //sd

        public class singleUserData
		{
			public string userid { get; set; }
			public string password { get; set; }
		} //public class singleData


        public class ProductDetailsObjectFilter
        {
            public string sku { get; set; }
            public string customerId { get; set; }
        }

    }
}
