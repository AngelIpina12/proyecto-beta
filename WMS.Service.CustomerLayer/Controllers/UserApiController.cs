using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Filter.User;
//using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Interfaces;


namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class UserApiController : WMSApiController
	{
		public UserApiController(IServiceProvider provider)
		   : base(provider)
		{
			_provider = provider;
		} // constructor


		[HttpPost("[action]")]

		public async Task<IActionResult> GetUserInfo([FromBody] SearchFilterUserData aUserData)
		{
			IManager fz = this.Manager;

			IManager localman = (IManager)_provider.GetService(typeof(IManager));
			var lresult = localman.UserManager.GetUserInfo(aUserData);


			return new JsonResult(lresult);

		} //GetSummary




	} //class

} //namespace 
