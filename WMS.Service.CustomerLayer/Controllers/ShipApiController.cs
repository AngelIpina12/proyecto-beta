using Microsoft.AspNetCore.Mvc;

using WMS.Service.CustomerLayer.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Filter.Ship;

namespace WMS.Service.CustomerLayer.Controllers
{
        [Route("api/[controller]")]
        [ApiController]
        [Authorize]

        public class ShipApiController : WMSApiController
        {

            public ShipApiController(IServiceProvider provider)
         : base(provider)
            {
                _provider = provider;
            }


        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipDet([FromBody] SearchFilterShip aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipDet(aFilter);


            return new JsonResult(lresult);

        } //GetTodayReceiveList

        //GetShipTodaySummary
        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipTodaySummary([FromBody] SearchFilterShUser aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipTodaySummary(aFilter);


            return new JsonResult(lresult);

        }

        //GetShipTodayDetail
        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipTodayDetail([FromBody] SearchFilterShUser aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipTodayDetail(aFilter);


            return new JsonResult(lresult);

        }
        //GetShipDetailByReqFolio
        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipDetailByReqFolio([FromBody] SearchFilterSHUsReqFolio aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipDetailByReqFolio(aFilter);


            return new JsonResult(lresult);

        }

        //GetShipDetailByEndCustomer
        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipDetailByEndCustomer([FromBody] SearchFilterSHUserECustom aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipDetailByEndCustomer(aFilter);


            return new JsonResult(lresult);

        }


        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipDetails([FromBody] SearchFilterShipDetails aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipDetails(aFilter);


            return new JsonResult(lresult);

        }
        //GetShipDetailByTrailerN

        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipDetailByTrailerN([FromBody] SearchFilterShUsTrailer aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipDetailByTrailerN(aFilter);


            return new JsonResult(lresult);

        }

        //GetShipByEndSKuCustom
        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipByEndSKuCustom([FromBody] SearchFilterShUsSKUEndC aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipByEndSKuCustom(aFilter);


            return new JsonResult(lresult);

        }

        //GetShipDetailByShipFolio
        [HttpPost("[action]")]

        public async Task<IActionResult> GetShipDetailByShipFolio([FromBody] SearchFilterSHUsShipFolio aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ShipManager.GetShipDetailByShipFolio(aFilter);


            return new JsonResult(lresult);

        }

    } // class



}
