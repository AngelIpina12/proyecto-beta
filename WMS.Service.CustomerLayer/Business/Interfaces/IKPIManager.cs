
using Microsoft.AspNetCore.Mvc;
using WMS.Service.CustomerLayer.Business.Filter.Cats;
using WMS.Service.CustomerLayer.Business.Filter.KPI;
using WMS.Service.CustomerLayer.Business.Objects.Cat;
using WMS.Service.CustomerLayer.Business.Objects.KPI;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IKPIManager
    {
        IKPIManager KPIManager { get; set; }
        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }
        public List<CustomerModule> GetCustomerModule();
        public List <CustomerUserInfo> GetUsersToSelect(ParamGetUserKPI afilter);

        //public CustomOptionRecordResp InsertUpdateCustomOption(CustomerOptionData aparam);

        public List<CustomOpInsItemRS> InsertUpdateCustomOption(CustomerListUsersOptionData aparam);
        public List<CustomOpInsItemRS> UpdateCustomOptions(List<CustomerOptionUpdate> options);
        public List<CustomerOptionDat> GetKPIOptionsForUserId(ParamKuser afilter);

        public List<WarehouseDataResp> GetWareHouses(ParamKuser afilter);

        public List<CustomerItemResp> GetCustomersFromWareHouse(ParamWareHouse afilter);

        public List<KpiOptionItemCWRS> GetKPIOptionsForWarehouseAndCustomer(ParamWarehouseCustomer afilter);

       public List<CustomOpInsItemRS> SetBaseUrlToUsers(BaseListUsersOptionData aparam);

        public CustomerOptionDat GetBaseOptionForUserId(ParamKuser afilter);
    }
}
