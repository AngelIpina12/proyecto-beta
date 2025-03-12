using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Filter.User;
//using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Filter.YM;
using WMS.Service.CustomerLayer.Business.Interfaces;


namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class YardApiController : WMSApiController
	{

		public YardApiController(IServiceProvider provider)
			: base(provider)
		{
			_provider = provider;
		}


		[HttpPost("[action]")]
		public async Task<IActionResult> GetSummary([FromBody] SearchFilterSingleUs aSingleUs)
		{
			IManager fz = this.Manager;

			IManager localman = (IManager)_provider.GetService(typeof(IManager));
		
            var lresult = localman.YardManager.GetSummaryTrailerDay(aSingleUs);
        
			return new JsonResult(lresult);
        
        } //GetSummary



        [HttpPost("[action]")] 
		public async Task<IActionResult> GetYardManagementList([FromBody] SearchYardMngList aFilterYM)
		{

			IManager fz = this.Manager;

			IManager localman = (IManager)_provider.GetService(typeof(IManager));
			var lresult = localman.YardManager.GetYardManagementList(aFilterYM);

			return new JsonResult(lresult);

		} //GetSummary

		[HttpPost("[action]")]
		public async Task<IActionResult> GetTrailerHistory([FromBody] SearchFilterFolioTR aTrailerFolio)
		{
			IManager fz = this.Manager;

			IManager localman = (IManager)_provider.GetService(typeof(IManager));
			var lresult = localman.YardManager.GetTrailerHistory(aTrailerFolio);

			return new JsonResult(lresult);

		} //GetTrailerHistory


		[HttpGet("[action]")]
		public async Task<IActionResult> GetTrailerStatusTypes()
		{
			IManager fz = this.Manager;

			IManager localman = (IManager)_provider.GetService(typeof(IManager));
			var lresult = localman.YardManager.GetTrailerStatusTypes();

			return new JsonResult(lresult);

		} //GetTrailerStatusTypes

        [HttpPost("[action]")]

        public async Task<IActionResult> GetEventImageListPath([FromBody] SearchImageEvent asearchImageFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localman.YardManager.GetEventImageListPath(asearchImageFilter);

            return new JsonResult(lresult);

        } //GetEventImageListPath

        [HttpPost("[action]")]

        public async Task<IActionResult> GetEventFileListPath([FromBody] SearchFileEvent asearchFileFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localman.YardManager.GetEventFileListPath(asearchFileFilter);

            return new JsonResult(lresult);

        } //GetEventFileListPath

    }
}
