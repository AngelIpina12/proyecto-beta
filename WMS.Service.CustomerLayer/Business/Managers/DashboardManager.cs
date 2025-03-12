using WMS.Service.CustomerLayer.Business.Filter.Dashboard;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Objects.Dashboard;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class DashboardManager : BaseManager, IDashboardManager
    {
        IServiceProvider _provider {  get; set; }

        IDashboardManager IDashboardManager.DashboardManager { get; set; }

        public DashboardManager(IDynamicRepository dynamicRepository, IServiceProvider serviceProvider)
        {
            _provider = serviceProvider;
            DynamicRepository = dynamicRepository;
        }

        public DashboardPalletsValues GetPalletsValues(SearchFiltersDashboard filters)
        {
            DashboardPalletsValues resultados = new DashboardPalletsValues();
            int palletsIn = 0;
            int palletOut = 0;
            palletsIn = DynamicRepository.All<int>("USP_CustomerPortal_DASHGetPalletsIn", new { CustomerId = filters.CustomerId }).First();
            palletOut = DynamicRepository.All<int>("USP_CustomerPortal_DASHGetPalletsOut", new{ CustomerId = filters.CustomerId}).First();
            resultados.PalletsIn = palletsIn;
            resultados.PalletsOut = palletOut;
            return resultados;
        }

        public DashboardRequirementsValues GetRequirementsValues(SearchFiltersDashboard filters)
        {
            DashboardRequirementsValues resultados = new DashboardRequirementsValues();
            int internalRequirements = 0;
            int externalRequirements = 0;
            internalRequirements = DynamicRepository.All<int>("USP_CustomerPortal_DASHGetInternalReq", new { CustomerId = filters.CustomerId }).First();
            externalRequirements = DynamicRepository.All<int>("USP_CustomerPortal_DASHGetExternalReq", new { CustomerId = filters.CustomerId }).First();
            resultados.InternalRequirements = internalRequirements;
            resultados.ExternalRequirements = externalRequirements;
            return resultados;
        }

        public DashboardVolumenTrailersValue GetVolumenTrailers(SearchFiltersDashboard filters)
        {
            DashboardVolumenTrailersValue resultados = new DashboardVolumenTrailersValue();
            int trailersInYard = 0;
            trailersInYard = DynamicRepository.All<int>("USP_CustomerPortal_DASHGetVolumenTrailers", new { CustomerId = filters.CustomerId }).First();
            resultados.TrailersInYard = trailersInYard;
            return resultados;
        }

    }
}
