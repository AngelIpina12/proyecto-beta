using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Web.Http.Filters;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.User;
using System.Runtime;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class RecepApiController : WMSApiController
    {
        public RecepApiController(IServiceProvider provider)
         : base(provider)
        {
            _provider = provider;
        }

        [HttpPost("[action]")]

        public async Task<IActionResult> GetTodayReceiveList([FromBody] SearchFilterSingleUs aSingleUs)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));
            
            var lresult = localman.ReceiveManager.GetTodayReceiveList(aSingleUs);

            return new JsonResult(lresult);

        } //GetTodayReceiveList


        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveFilterList([FromBody] SearchFilterOpMult aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetReceiveFilterList(aFilter);

            return new JsonResult(lresult);

        } //GetReceiveFilterList


        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveListByRecFolio([FromBody] SearchFilterRECFolio aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetReceiveListByRecFolio(aFilter);

            return new JsonResult(lresult);

        } //GetReceiveFilterList

        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveSKUAndFolioInfo([FromBody] SearchFilterSKUAndFolio aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetReceiveSKUAndFolioInfo(aFilter);

            return new JsonResult(lresult);

        }        //GetReceiveSKUAndFolioInfo

        
        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveListByCustomerDate([FromBody] SearchFilterRECCustomerDtm aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetReceiveListByCustomerDate(aFilter);

            return new JsonResult(lresult);

        }        //GetReceiveListByCustomerDate


        [HttpPost("[action]")]
        public async Task<IActionResult> GetEndCustomerCatalog([FromBody] SearchEndCustomer aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetEndCustomerCatalog(aFilter);

            return new JsonResult(lresult);

        }        //GetReceiveListByCustomerDate

        //List<ReceiveInfoGroupGenericVS> GetReceiveListBySKUDate(SearchFilterRECSKUDtm aFilter);
        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveListBySKUDate([FromBody] SearchFilterRECSKUDtm aFilter)
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetReceiveListBySKUDate(aFilter);

            return new JsonResult(lresult);

        }        //GetReceiveListBySKUDate

        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveListBySupplierDate([FromBody] SearchFilterRECSupplierDtm afilter)
        {
                        
            IManager localmanager = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localmanager.ReceiveManager.GetReceiveListBySupplierDate(afilter);
            return new JsonResult(lresult);


        } // public async Task<IActionResult> GetReceiveListBySupplierDate([FromBody] SearchFilterRECSupplierDtm afilter)
          //

        //GetReceiveListByDate

        [HttpPost("[action]")]
        public async Task<IActionResult> GetReceiveListByDate([FromBody] SearchFilterRECDate  afilter)
        {

            IManager localmanager = (IManager)_provider.GetService(typeof(IManager));
            var lresult = localmanager.ReceiveManager.GetReceiveListByDate(afilter);
            return new JsonResult(lresult);


        } // public async Task<IActionResult> GetReceiveListBySupplierDate([FromBody] SearchFilterRECSupplierDtm afilter)

        [HttpPost("[action]")]
        public IActionResult GetEndCustomerList()
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetEndCustomerList();

            return new JsonResult(lresult);
        }

        [HttpPost("[action]")]
        public IActionResult GetSupplierList()
        {
            IManager fz = this.Manager;

            IManager localman = (IManager)_provider.GetService(typeof(IManager));

            var lresult = localman.ReceiveManager.GetSupplierList();

            return new JsonResult(lresult);
        }
    }//class
}//namespace
