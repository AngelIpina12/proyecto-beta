using System.Xml.Linq;
using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter;
using WMS.Service.CustomerLayer.Business.Filter.Cats;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Objects.Cat;
using WMS.Service.CustomerLayer.Business.Objects.Inv;
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.Business.Objects.us;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class CatalogManager : BaseManager, ICatalogManager
    {

        IServiceProvider _provider { get; set; }

        ICatalogManager ICatalogManager.CatalogManager { get; set; }
        public CatalogManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }

        public List<ProductSKU> GetProductSKUCustom(SearchCatProdBySKU aFilter)
        {
            List<int> customerIds = new List<int>();
            List<int> cpIds = new List<int>();
            List<int> supIds = new List<int>();


            customerIds.Add(aFilter.customerId);
            List<ProductSKU> list_return = new List<ProductSKU>();

            list_return = DynamicRepository.All<ProductSKU>("USP_ProductsByName_Get", new
            {
                Name = aFilter.strName,
                CustomerId = aFilter.customerId,
                Type = 0,
                SkuType = 0,
                wkType = 0,
                Supplierids = CustomDataTableExtensions.ToDataTable<int>(supIds, "Id"),
                customerProductIds = CustomDataTableExtensions.ToDataTable<int>(cpIds, "Id"),
                customerIds = CustomDataTableExtensions.ToDataTable<int>(customerIds, "Id")
            });



            return list_return;
        }

        //
        public List<EndCustomerVS> GetEndCustomer(SearchCatEndCustomer aFilter)
        {
            List<UserData> llget_user = new List<UserData>();
            List<EndCustomerVS> llist_return = new List<EndCustomerVS>();
            List<EndCustomerRS> llist_get = new List<EndCustomerRS>();
            EndCustomerVS itemVS = new EndCustomerVS();
            SearchFilterUserData lobj_userFilter = new SearchFilterUserData();
            WHRestriction lrestriction = new WHRestriction();

            int lint_WCustomerId = 0;
            int lint_WareHouseId = 0;
            lobj_userFilter.PWD = "";
            lobj_userFilter.Type = "";
            lobj_userFilter.UserId = aFilter.intUserId;
            lobj_userFilter.UserName = "";
        
            //
            List<WHRestriction> listWres = new List<WHRestriction>();
            


            llget_user = DynamicRepository.All<UserData>("USP_GetUserInfo", SearchFilterMapper.MapUSDataFilter("UserDataFilter", lobj_userFilter));

            if (llget_user.Count > 0)
            {
                lint_WareHouseId = llget_user[0].WhareHouseId;
                lint_WCustomerId = llget_user[0].WareCustomerId;
                lrestriction.Id = lint_WareHouseId;
                lrestriction.Type = 3;
                listWres.Add(lrestriction);

                llist_get = DynamicRepository.All<EndCustomerRS>("USP_CustomersByName_Get", new { Name = aFilter.strName, CQCustomerId = lint_WCustomerId, WhRes = CustomDataTableExtensions.ToDataTable<WHRestriction>(listWres, new string[] { "Id", "Type", "StrId" }) });

                foreach (EndCustomerRS litem in llist_get)
                {
                    itemVS = new EndCustomerVS()
                    {
                        Id = litem.Id
                     ,
                        Name = litem.Name
                    };

                    llist_return.Add(itemVS);
                }

            }

            return llist_return;
        }
        //
        public List<SupplierVS> GetSupplier(SearchCatSupplier aFilter)
        {
            List<UserData> llget_user = new List<UserData>();
            List<SupplierVS> llist_return = new List<SupplierVS>();
            List<SupplierRS> llist_get = new List<SupplierRS>();
            SupplierVS itemVS = new SupplierVS();
            SearchFilterUserData lobj_userFilter = new SearchFilterUserData();
            WHRestriction lrestriction = new WHRestriction();
            int lint_CustomerID = 0;
            int lint_WCustomerId = 0;
            int lint_WareHouseId = 0;
            lobj_userFilter.PWD = "";
            lobj_userFilter.Type = "";
            lobj_userFilter.UserId = aFilter.intUserId;
            lobj_userFilter.UserName = "";

            //
            List<WHRestriction> listWres = new List<WHRestriction>();



            llget_user = DynamicRepository.All<UserData>("USP_GetUserInfo", SearchFilterMapper.MapUSDataFilter("UserDataFilter", lobj_userFilter));

            if (llget_user.Count > 0)
            {
                lint_CustomerID = llget_user[0].CustomerId;

                List<int> customerIds = new List<int>();
                customerIds.Add(lint_CustomerID);

                llist_get= DynamicRepository.All<SupplierRS>("USP_CustomerSuppliers_GetForAutolist", new { CustomerId = lint_CustomerID, Name = aFilter.strName, Type = 1, CustomerIds = CustomDataTableExtensions.ToDataTable<int>(customerIds, "Id") });

                foreach (SupplierRS itemrs in llist_get)
                {
                    itemVS = new SupplierVS()
                    {
                        Id = itemrs.Id
                     ,
                        Name = itemrs.Name
                    };

                    llist_return.Add(itemVS);
                }

            }

            return llist_return;
        }
        //

        public List<SuppSKURS> GetSupplierSKU(SearchCatSuppSKU aFilter)
        {
      
            List<SuppSKURS> list_return = new List<SuppSKURS>();

            list_return = DynamicRepository.All<SuppSKURS>("USP_CustomerPortal_CATInvSupplierSKU", new
            {
                intUserId = aFilter.intUserId,
                strSupSKU = aFilter.strName
            });



            return list_return;

        }
    } // catmanager
} // namespace
