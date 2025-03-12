using Microsoft.AspNetCore.Mvc;

using WMS.Service.CustomerLayer.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using WMS.Service.CustomerLayer.Business.Filter.Inv;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InvApiController : WMSApiController
    {
        public InvApiController(IServiceProvider provider)
         : base(provider)
        {
            _provider = provider;
        }

        [HttpPost("[action]")]

        public async Task<IActionResult> GetTodayInv([FromBody] SearchFilterInvA aSingleUs)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetTodayInv(aSingleUs);
            

            return new JsonResult(lresult);

        } //GetTodayReceiveList

        [HttpPost("[action]")]

        public async Task<IActionResult> GetSKUInWork([FromBody] SearchFilterSKUInv aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetSKUInWork(aFilter);


            return new JsonResult(lresult);

        } //GetTodayReceiveList

        //GetSKUAllocated

        [HttpPost("[action]")]

        public async Task<IActionResult> GetSKUAllocated([FromBody] SearchFilterSKUInv aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetSKUAllocated(aFilter);


            return new JsonResult(lresult);

        } //GetSKUAllocated

        //GetSKUNOTAllocated

        [HttpPost("[action]")]

        public async Task<IActionResult> GetSKUNOTAllocated([FromBody] SearchFilterSKUInv aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetSKUNOTAllocated(aFilter);


            return new JsonResult(lresult);

        } //GetSKUAllocated


        //GetSKUOnHand

        [HttpPost("[action]")]

        public async Task<IActionResult> GetSKUOnHand([FromBody] SearchFilterSKUInv aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetSKUOnHand(aFilter);


            return new JsonResult(lresult);

        } //GetSKUOnHand

        //GetInvByEndSKU
        [HttpPost("[action]")]

        public async Task<IActionResult> GetInvByEndSKU([FromBody] SearchFilterSKU aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetInvByEndSKU(aFilter);

            return new JsonResult(lresult);

        }//GetInvByEndSKU

        //GetInvByEndCustomer
        [HttpPost("[action]")]

        public async Task<IActionResult> GetInvByEndCustomer([FromBody] SearchFilterEndCustomer aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetInvByEndCustomer(aFilter);

            return new JsonResult(lresult);

        }//GetInvByEndSKU

        //GetInvBySupplierSKU
        [HttpPost("[action]")]

        public async Task<IActionResult> GetInvBySupplierSKU([FromBody] SearchFilterSuppSKU aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetInvBySupplierSKU(aFilter);

            return new JsonResult(lresult);

        }

        //GetInvBySupplierSKU
        [HttpPost("[action]")]

        public async Task<IActionResult> GetInvBySupplier([FromBody] SearchFilterSupplier aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetInvBySupplier(aFilter);

            return new JsonResult(lresult);

        }

        [HttpPost("[action]")]
        public IActionResult GetSupplierList()
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.InvManager.GetSupplierList();

            return new JsonResult(lresult);
        }
    }
}
