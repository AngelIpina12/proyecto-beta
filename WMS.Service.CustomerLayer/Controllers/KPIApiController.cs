using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using WMS.Service.CustomerLayer.Business.Filter.Ship;
using WMS.Service.CustomerLayer.Business.Filter.KPI;
using WMS.Service.CustomerLayer.Business.Objects.KPI;
using System.Web.Http.Filters;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class KPIApiController : WMSApiController
    {
        public KPIApiController(IServiceProvider provider)
      : base(provider)
        {
            _provider = provider;
        }

        [HttpPost("[action]")]

        public async Task<IActionResult> GetCustomerModules()
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetCustomerModule();


            return new JsonResult(lresult);

        } //GetTodayReceiveList

        //GetUsersToSelect
        [HttpPost("[action]")]

        public async Task<IActionResult> GetUsersToSelect(ParamGetUserKPI afilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetUsersToSelect(afilter);


            return new JsonResult(lresult);

        } //

        //InsertUpdateCustomOption
        [HttpPost("[action]")]

        
        //public async Task<IActionResult> InsertUpdateCustomOption(CustomerOptionData aobject)
        public async Task<IActionResult> InsertUpdateCustomOption(CustomerListUsersOptionData aobject)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.InsertUpdateCustomOption(aobject);


            return new JsonResult(lresult);

        } //

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateCustomOptions(List<CustomerOptionUpdate> aobject)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.UpdateCustomOptions(aobject);


            return new JsonResult(lresult);

        } //

        //GetKPIOptionsForUserId
        [HttpPost("[action]")]

        public async Task<IActionResult> GetKPIOptionsForUserId(ParamKuser afilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetKPIOptionsForUserId(afilter);


            return new JsonResult(lresult);

        } //

        [HttpPost("[action]")]

        public async Task<IActionResult> GetWareHouses(ParamKuser afilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetWareHouses(afilter);


            return new JsonResult(lresult);

        } //

        //GetCustomersFromWareHouse
        [HttpPost("[action]")]
        public async Task<IActionResult> GetCustomersFromWareHouse(ParamWareHouse afilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetCustomersFromWareHouse(afilter);


            return new JsonResult(lresult);

        } //

        //GetKPIOptionsForWarehouseAndCustomer
        [HttpPost("[action]")]
        public async Task<IActionResult> GetKPIOptionsForWarehouseAndCustomer(ParamWarehouseCustomer afilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetKPIOptionsForWarehouseAndCustomer(afilter);


            return new JsonResult(lresult);

        } //

        //SetBaseUrlToUsers
        [HttpPost("[action]")]
        public async Task<IActionResult> SetBaseUrlToUsers(BaseListUsersOptionData afilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.SetBaseUrlToUsers(afilter);


            return new JsonResult(lresult);

        }

        // GetBaseOptionsForUserId(ParamKuser afilter)
        
        [HttpPost("[action]")]
        public async Task<IActionResult> GetBaseOptionForUserId(ParamKuser afilter)                  
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.KPIManager.GetBaseOptionForUserId(afilter);


            return new JsonResult(lresult);

        } //
    

    }
}
