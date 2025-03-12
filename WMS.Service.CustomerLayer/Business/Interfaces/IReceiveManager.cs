using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.Business.Filter.Req;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IReceiveManager
    {
        IReceiveManager ReceiveManager { get; set; }
        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }

        List<ReceiveTodayItemVisual> GetTodayReceiveList(SearchFilterSingleUs aSearchFilterSingleUs);

        List<ReceiveItemVisual> GetReceiveFilterList(SearchFilterOpMult aFilter);

        List<ReceiveItemVisual> GetReceiveListByRecFolio(SearchFilterRECFolio aFilter);

        ReceiveInfoSKUFolioVS GetReceiveSKUAndFolioInfo(SearchFilterSKUAndFolio aFilter);

        List<ReceiveItemCustomerVS> GetReceiveListByCustomerDate(SearchFilterRECCustomerDtm aFilter);

        List<EndCustomerCAT> GetEndCustomerCatalog(SearchEndCustomer aFilter);

        List<ReceiveInfoGroupGenericVS> GetReceiveListBySKUDate(SearchFilterRECSKUDtm aFilter);

        List<ReceiveInfoItemSupplierVS> GetReceiveListBySupplierDate(SearchFilterRECSupplierDtm aFilter);

        List<ReceiveInfoGroupGenericVS> GetReceiveListByDate(SearchFilterRECDate aFilter);

        List<RECGetEndCustomerList> GetEndCustomerList();

        List<RECGetSupplierList> GetSupplierList();

    } //interface 


} //namespace
