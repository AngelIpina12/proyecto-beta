using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WMS.Service.CustomerLayer.Business.Filter.Ship;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Filter.Cats;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class CatApiController : WMSApiController
    {
        public CatApiController(IServiceProvider provider)
        : base(provider)
        {
            _provider = provider;
        }



        [HttpPost("[action]")]

        public async Task<IActionResult> GetProductSKUCustom([FromBody] SearchCatProdBySKU aFilter)
        {
            //  public List<ProductSKU> GetProductSKUCustom(string name, int customerId);
            IManager fz = this.Manager;


            IManager localman = (IManager)_provider.GetService(typeof(IManager));


            var lresult = localman.CatalogManager.GetProductSKUCustom(aFilter);

            return new JsonResult(lresult);

        } //GetTodayReceiveList

        //  
        [HttpPost("[action]")]

        public async Task<IActionResult>  GetEndCustomer(SearchCatEndCustomer aFilter)
        {
            //  public List<ProductSKU> GetProductSKUCustom(string name, int customerId);
            IManager fz = this.Manager;


            IManager localman = (IManager)_provider.GetService(typeof(IManager));


            var lresult = localman.CatalogManager.GetEndCustomer(aFilter);

            return new JsonResult(lresult);

        } //GetTodayReceiveList

        //GetSupplier
        [HttpPost("[action]")]

        public async Task<IActionResult> GetSupplier(SearchCatSupplier aFilter)
        {
            //  public List<ProductSKU> GetProductSKUCustom(string name, int customerId);
            IManager fz = this.Manager;


            IManager localman = (IManager)_provider.GetService(typeof(IManager));


            var lresult = localman.CatalogManager.GetSupplier(aFilter);

            return new JsonResult(lresult);

        }

        
        [HttpPost("[action]")]

        public async Task<IActionResult> GetSupplierSKU(SearchCatSuppSKU aFilter)
        {
            
            IManager fz = this.Manager;


            IManager localman = (IManager)_provider.GetService(typeof(IManager));


            var lresult = localman.CatalogManager.GetSupplierSKU(aFilter);

            return new JsonResult(lresult);

        }
    }
}//name
