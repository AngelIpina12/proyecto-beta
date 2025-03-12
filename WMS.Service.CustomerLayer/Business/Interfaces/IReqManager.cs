using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Objects.Req;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IReqManager
    {
        IReqManager ReqManager { get; set; }
        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }

        List<ReqInfoItemVS> GetActiveRequirements(SearchFilterReqActive aFilter);
        List<ReqDetailVS> GetListRequirementDetails(SearchFilterReqDetail aFilter);
        List<ReqSKUEndCustomerVS> GetListRequirementSKUEndCustomer(SearchFilterReqSKUEndCustomer aFilter);
        List<ReqCQFolioVS> GetListRequirementCQFolio(SearchFilterReqCQFolio aFilter);
        List<ReqCQCustomerFolioVS> GetListRequirementCQCustomerFolio(SearchFilterReqCQCustomerFolio aFilter);
        List<ReqSupplierVS> GetListRequirementSupplier(SearchFilterReqSupplier aFilter);
        List<ReqType> GetRequirementTypes();
        List<ReqAutocompleteListVS> GetSKUList(SearchFilterReqSKUList aFilter);
        List<ReqAutocompleteListVS> GetSupplierList(SearchFilterReqSKUList aFilter);
    }
}
