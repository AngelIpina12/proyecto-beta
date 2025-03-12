using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using WMS.Service.CustomerLayer.Business.Interfaces;

using WMS.Service.CustomerLayer.Ioc;

namespace WMS.Service.CustomerLayer.Controllers
{
     public class WMSApiController : ApiController
    {
        public static object criticalLock = new object();
        public IServiceProvider _provider;
        public WMSApiController(IServiceProvider provider)
        {
            _provider = provider;
        }

        [SimpleIoCPropertyInject]
        public IManager Manager { get; set; }

    } //class
} //namspace
