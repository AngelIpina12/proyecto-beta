using System.Security.Cryptography;
using System.Web.Http.Filters;
using System.Xml.Linq;
using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter;
using WMS.Service.CustomerLayer.Business.Filter.Cats;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Filter.KPI;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Objects.Cat;
using WMS.Service.CustomerLayer.Business.Objects.Inv;
using WMS.Service.CustomerLayer.Business.Objects.KPI;
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.Business.Objects.us;
using WMS.Service.CustomerLayer.Business.Objects.YM;
using WMS.Service.CustomerLayer.DAL;


namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class KPIManager : BaseManager, IKPIManager
    {
        IServiceProvider _provider { get; set; }

        IKPIManager IKPIManager.KPIManager { get; set; }

        public KPIManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }

        public List<CustomerModule> GetCustomerModule()
        {
            return DynamicRepository.All<CustomerModule>("USP_CustomerPortal_GetCustomerModules", null);

        }
        public List<CustomerUserInfo> GetUsersToSelect(ParamGetUserKPI afilter)
        {
            FilterSearchUserWC searchKPIFilter = new FilterSearchUserWC();
            searchKPIFilter.intUserId = afilter.intUserId;
            searchKPIFilter.intWareHouseId = afilter.intWareHouseId;
            searchKPIFilter.intCustomerId = afilter.intCustomerId;            
            return DynamicRepository.All<CustomerUserInfo>("USP_CustomerPortal_GetUserstoSelect", SearchFilterMapper.MapKPIUserWC("userWC", searchKPIFilter));

        }

        //public CustomOptionRecordResp InsertUpdateCustomOption(CustomerOptionData aparam)
        public List<CustomOpInsItemRS> InsertUpdateCustomOption(CustomerListUsersOptionData aparam)
        {
            CustomOpInsItemRS itemResult = new CustomOpInsItemRS();
            List<CustomOpInsItemRS> list = new List<CustomOpInsItemRS>();
            CustomerOptionData lcustomerOptionData = new CustomerOptionData();
            var userIds = aparam.listUsersIds;

            if (userIds == null)
            {
                userIds = new List<int>();
            }
            foreach (int lint_userid in userIds)
            {
                itemResult = new CustomOpInsItemRS();
                itemResult.intUserId = lint_userid;

                lcustomerOptionData.intOptionId = aparam.intOptionId;
                lcustomerOptionData.strLegend = aparam.strLegend;
                lcustomerOptionData.strUrl = aparam.strUrl;
                lcustomerOptionData.intModuleId = aparam.intModuleId;
                lcustomerOptionData.intUserIdAdmin = aparam.intUserIdAdmin;
                lcustomerOptionData.intUserIdToAssing = lint_userid;
                lcustomerOptionData.strTitle = aparam.strTitle;
                lcustomerOptionData.intActive = aparam.intActive;


                List<CustomOptionRecordResp> listresult = new List<CustomOptionRecordResp>();
                //listresult = DynamicRepository.All<CustomOptionRecordResp>("USP_CustomerPortal_InsertUpdateOption", aparam);
                listresult = DynamicRepository.All<CustomOptionRecordResp>("USP_CustomerPortal_InsertUpdateOption", lcustomerOptionData);

                itemResult.intOptionId = listresult[0].intOptionId;
                itemResult.strError = listresult[0].strError;
                itemResult.intUserId = lint_userid;



                list.Add(itemResult);
            }//foreach (int lint_userid in aparam.listUsersIds)

            return list;
        }

        public List<CustomOpInsItemRS> UpdateCustomOptions(List<CustomerOptionUpdate> options)
        {
            List<CustomOpInsItemRS> resultList = new List<CustomOpInsItemRS>();

            foreach (var option in options)
            {
                var updateParams = new
                {
                    intOptionId = option.intOptionId,
                    intActive = option.intActive,
                    intUserIdAdmin = option.intUserIdAdmin
                };

                // Llamada al procedimiento almacenado para cada opción
                List<CustomOptionRecordResp> updateResult = DynamicRepository.All<CustomOptionRecordResp>(
                    "USP_CustomerPortal_UpdateCustomOptions",
                    updateParams
                );

                if (updateResult.Any())
                {
                    var resultItem = new CustomOpInsItemRS
                    {
                        intOptionId = updateResult[0].intOptionId,
                        strError = updateResult[0].strError
                    };

                    resultList.Add(resultItem);
                }
                else
                {
                    var resultItem = new CustomOpInsItemRS
                    {
                        intOptionId = option.intOptionId,
                        strError = "Update failed or no rows affected."
                    };

                    resultList.Add(resultItem);
                }
            }

            return resultList;
        }

        public List<CustomerOptionDat> GetKPIOptionsForUserId(ParamKuser afilter)
        {
            SearchKPIFilter searchKPIFilter = new SearchKPIFilter();
            searchKPIFilter.intUserId = afilter.intUserId;
            List<CustomerOptionDat> lob = new List<CustomerOptionDat>();
            return DynamicRepository.All<CustomerOptionDat>("USP_CustomerPortal_GetKPIOptionsForUserId", SearchFilterMapper.MapKPI("user", searchKPIFilter));

        }

        public List<WarehouseDataResp> GetWareHouses(ParamKuser afilter)
        {

            SearchKPIFilter searchKPIFilter = new SearchKPIFilter();
            searchKPIFilter.intUserId = afilter.intUserId;            
            return DynamicRepository.All<WarehouseDataResp>("USP_CustomerPortal_GetWareHouses", SearchFilterMapper.MapKPI("user", searchKPIFilter));

        }


        public List<CustomerItemResp> GetCustomersFromWareHouse(ParamWareHouse afilter)
        {
            CustomerFilterW filtercustomerw = new CustomerFilterW();
            filtercustomerw.intUserId = afilter.intUserId;
            filtercustomerw.intWareHouseid = afilter.intWareHouseid;            
            
            return DynamicRepository.All<CustomerItemResp>("USP_CustomerPortal_GetCustomersFromWareHouse", SearchFilterMapper.MapCustomerAndWareHouse("warehouse", filtercustomerw));

        }

        public List<KpiOptionItemCWRS> GetKPIOptionsForWarehouseAndCustomer(ParamWarehouseCustomer afilter)
        {
            FilterSearchUserWC filtercustomerw = new FilterSearchUserWC();
            filtercustomerw.intWareHouseId= afilter.intWarehouseid;
            filtercustomerw.intCustomerId= afilter.intCustomerid;

            return DynamicRepository.All<KpiOptionItemCWRS>("USP_CustomerPortal_GetKPIOptionsFromCustomerAndWareHouse", SearchFilterMapper.MapKPIUserWC("WC", filtercustomerw));

        }

        public List<CustomOpInsItemRS> SetBaseUrlToUsers(BaseListUsersOptionData aparam)
        {
            CustomOpInsItemRS itemResult = new CustomOpInsItemRS();
            List<CustomOpInsItemRS> list = new List<CustomOpInsItemRS>();
            BaseOptionData lcustomerOptionData = new BaseOptionData();
            var userIds = aparam.listUsersIds;

            if (userIds == null)
            {
                userIds = new List<int>();
            }
            foreach (int lint_userid in userIds)
            {
                itemResult = new CustomOpInsItemRS();
                itemResult.intUserId = lint_userid;

                
                lcustomerOptionData.strUrl = aparam.strUrl;             
                lcustomerOptionData.intUserIdAdmin = aparam.intUserIdAdmin;
                lcustomerOptionData.intUserIdToAssing = lint_userid;               


                List<CustomOptionRecordResp> listresult = new List<CustomOptionRecordResp>();                
                listresult = DynamicRepository.All<CustomOptionRecordResp>("USP_CustomerPortal_SetBaseToUserId", lcustomerOptionData);

                itemResult.intOptionId = listresult[0].intOptionId;
                itemResult.strError = listresult[0].strError;
                itemResult.intUserId = lint_userid;



                list.Add(itemResult);
            }//foreach (int lint_userid in aparam.listUsersIds)

            return list;
        }

        public CustomerOptionDat GetBaseOptionForUserId(ParamKuser afilter)
        {
            SearchKPIFilter searchKPIFilter = new SearchKPIFilter();
            searchKPIFilter.intUserId = afilter.intUserId;
            List<CustomerOptionDat> lob = new List<CustomerOptionDat>();
            CustomerOptionDat lsingle = new CustomerOptionDat();

             lob = DynamicRepository.All<CustomerOptionDat>("USP_CustomerPortal_GetBaseForUserId", SearchFilterMapper.MapKPI("user", searchKPIFilter));

            try {

                lsingle.intActive = lob[0].intActive;
                lsingle.strLegend = lob[0].strLegend;
                lsingle.strDisplayText = lob[0].strDisplayText;
                lsingle.strTitle = lob[0].strTitle;
                lsingle.strUrl = lob[0].strUrl;
                lsingle.intModuleId = lob[0].intModuleId;
                lsingle.intOptionId = lob[0].intOptionId;
                
            }
            catch (Exception ex)
            { }
            return lsingle;
        }

    } //class
} //name
