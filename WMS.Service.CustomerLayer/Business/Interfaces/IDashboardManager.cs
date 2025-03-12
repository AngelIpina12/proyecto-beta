using WMS.Service.CustomerLayer.Business.Filter.Dashboard;
using WMS.Service.CustomerLayer.Business.Objects.Dashboard;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IDashboardManager
    {
        IDashboardManager DashboardManager { get; set; }
        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }
        DashboardPalletsValues GetPalletsValues(SearchFiltersDashboard filters);
        DashboardRequirementsValues GetRequirementsValues(SearchFiltersDashboard filters);
        DashboardVolumenTrailersValue GetVolumenTrailers(SearchFiltersDashboard filters);
    }
}
