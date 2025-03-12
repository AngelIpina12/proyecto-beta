using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Objects.Inv;
using WMS.Service.CustomerLayer.Business.Objects.Req;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IInvManager
    {
        IInvManager InvManager { get; set; }
        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }

       public List<InvInfoTodayVS> GetTodayInv(SearchFilterInvA aFilter);

        public List<InvSKUWorkVS> GetSKUInWork(SearchFilterSKUInv aFilter);

        public List<InvSKUAllocateVS> GetSKUAllocated(SearchFilterSKUInv aFilter);

        public List<InSKUNotAllocatedVS> GetSKUNOTAllocated(SearchFilterSKUInv aFilter);

        public List<InvSKUOnHandVS> GetSKUOnHand(SearchFilterSKUInv aFilter);
        public List<InvBySKUEndCustomerRS> GetInvByEndSKU(SearchFilterSKU aFilter);

        public List<InvEndCustomerRS> GetInvByEndCustomer( SearchFilterEndCustomer aFilter);

        public List<InvSuppilerSKURS> GetInvBySupplierSKU(SearchFilterSuppSKU aFilter);

        public List<InvBySupplierRS> GetInvBySupplier(SearchFilterSupplier aFilter);

        public List<INVGetSupplierList> GetSupplierList();
    } // interfac
}
