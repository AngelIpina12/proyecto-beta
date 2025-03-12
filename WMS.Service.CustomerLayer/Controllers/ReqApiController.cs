using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Web.Http.Filters;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Objects.Req;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReqApiController : WMSApiController
    {

        public ReqApiController(IServiceProvider provider) 
            : base(provider) {

            _provider = provider;
        }

        [HttpPost("[action]")]
        public IActionResult GetActiveRequirements([FromBody] SearchFilterReqActive aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetActiveRequirements(aFilter);

            return new JsonResult(lresult);

        }


        [HttpPost("[action]")]
        public IActionResult GetListRequirementDetails([FromBody] SearchFilterReqDetail aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetListRequirementDetails(aFilter);

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetListRequirementSKUEndCustomer([FromBody] SearchFilterReqSKUEndCustomer aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetListRequirementSKUEndCustomer(aFilter);

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetListRequirementCQFolio([FromBody] SearchFilterReqCQFolio aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetListRequirementCQFolio(aFilter);

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetListRequirementCQCustomerFolio([FromBody] SearchFilterReqCQCustomerFolio aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetListRequirementCQCustomerFolio(aFilter);

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetListRequirementSupplier([FromBody] SearchFilterReqSupplier aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetListRequirementSupplier(aFilter);

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetRequirementTypes()
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetRequirementTypes();

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetSKUList([FromBody] SearchFilterReqSKUList aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetSKUList(aFilter);

            return new JsonResult(lresult);
        }


        [HttpPost("[action]")]
        public IActionResult GetSupplierList([FromBody] SearchFilterReqSKUList aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReqManager.GetSupplierList(aFilter);

            return new JsonResult(lresult);
        }
    }
}
