using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.Dashboard;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardApiController : WMSApiController
    {
        public DashboardApiController(IServiceProvider provider) : base(provider)
        {
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetPalletsValues([FromBody] SearchFiltersDashboard filters)
        {
            IManager localman = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localman.DashboardManager.GetPalletsValues(filters);
            return new JsonResult(lresult);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetRequirementsValues([FromBody] SearchFiltersDashboard filters)
        {
            IManager localman = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localman.DashboardManager.GetRequirementsValues(filters);
            return new JsonResult(lresult);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetVolumenTrailers([FromBody] SearchFiltersDashboard filters)
        {
            IManager localman = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localman.DashboardManager.GetVolumenTrailers(filters);
            return new JsonResult(lresult);
        }
    }
}
