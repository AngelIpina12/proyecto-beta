using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.Business.Objects.Req;
using WMS.Service.CustomerLayer.Constants;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class ReqManager : BaseManager, IReqManager
    {

        IServiceProvider _provider { get; set; }
   

        public ReqManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }
        IReqManager IReqManager.ReqManager { get; set; }

        public List<ReqInfoItemVS> GetActiveRequirements(SearchFilterReqActive aFilter)
        {
            List<ReqInfoItemRS> list_get = new List<ReqInfoItemRS>();
            List<ReqInfoItemVS> list_return = new List<ReqInfoItemVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqInfoItemVS itemVisual = new ReqInfoItemVS();

            lobj_Filter.UserId = aFilter.UserId;

            list_get = DynamicRepository.All<ReqInfoItemRS>("USP_CustomerPortal_REQGetActive", SearchFilterMapper.MapReq("Today", lobj_Filter));
            // conertir lista 
            foreach (ReqInfoItemRS item in list_get)
            {
                itemVisual = new ReqInfoItemVS()
                {
                     decProgress = item.intAdvancePercentage
                    , strAllocationDate = item.dtmCurrentDate.HasValue ? item.dtmCurrentDate.Value.ToString("dd-MMM.yyyy  H:mm").ToUpper() : string.Empty
                    , strCQFolio = item.strREQFolio
                    , strCustomerFolio = item.strCustomerFolio
                };
                itemVisual.strAllocationDate = itemVisual.strAllocationDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        }

        public List<ReqDetailVS>GetListRequirementDetails(SearchFilterReqDetail aFilter)
        {
            List<ReqDetailRS> list_get = new List<ReqDetailRS>();
            List<ReqDetailVS> list_return = new List<ReqDetailVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqDetailVS itemVisual = new ReqDetailVS();

            lobj_Filter.strReqFolio = aFilter.strReqFolio;

            list_get = DynamicRepository.All<ReqDetailRS>("USP_CustomerPortal_REQGetListRequerimentDetails", SearchFilterMapper.MapReq("Details", lobj_Filter));

            foreach (ReqDetailRS item in list_get)
            {
                itemVisual = new ReqDetailVS()
                {
                    strSKUEndCustomer = item.strPartNumber,
                    strUOM = item.strUOM,
                    decQtyRequired = Decimal.ToInt32(item.decQuantity),
                    decQtyAllocated = Decimal.ToInt32(item.decQtyAssigned),
                    decQtyNotAllocated = Decimal.ToInt32(item.decPendingQty),
                    intQtyPickeds = Decimal.ToInt32(item.intPicking),
                    decQtyShipped = Decimal.ToInt32(item.decQtyShipped),
                    intInventoryId = Decimal.ToInt32(item.intInventoryId),
                    intShipmentId = Decimal.ToInt32(item.intShipmentId)
                };
                list_return.Add(itemVisual);
            } 
            return list_return;
        }

        public List<ReqSKUEndCustomerVS> GetListRequirementSKUEndCustomer(SearchFilterReqSKUEndCustomer aFilter)
        {
            List<ReqSKUEndCustomerRS> list_get = new List<ReqSKUEndCustomerRS>();
            List<ReqSKUEndCustomerVS> list_return = new List<ReqSKUEndCustomerVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqSKUEndCustomerVS itemVisual = new ReqSKUEndCustomerVS();

            lobj_Filter.UserId = aFilter.intUserId;
            lobj_Filter.strSKUEndCustomer = aFilter.strSKUEndCustomer;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReqSKUEndCustomerRS>("USP_CustomerPortal_REQGetListBySKUEndCustomer", SearchFilterMapper.MapReq("SKUEndCustomer", lobj_Filter));

            foreach (ReqSKUEndCustomerRS item in list_get)
            {
                itemVisual = new ReqSKUEndCustomerVS()
                {
                    strSKUEndCustomer = item.strSKUEndCustomer,
                    strUOM = item.strUOM,
                    strCQFolio = item.strREQFolio,
                    intCustomerFolio = item.intFOLIO,
                    strDateRequired = item.dtmCurrentDate.ToString("dd-MMMyyyy  H:mm"),
                    intAdvancePercentage = Decimal.ToInt32(item.intAdvancePercentage),
                    decQtyRequired = Decimal.ToInt32(item.decQuantity),
                    decQtyAllocated = Decimal.ToInt32(item.decQtyAssigned),
                    decQtyNotAllocated = Decimal.ToInt32(item.decPendingQty),
                    intQtyPickeds = Decimal.ToInt32(item.intPicking),
                    decQtyShipped = Decimal.ToInt32(item.decQtyShipped),
                    intInventoryId = Decimal.ToInt32(item.intInventoryId),
                    intShipmentId = Decimal.ToInt32(item.intShipmentId)
                };
                list_return.Add(itemVisual);
            }
            return list_return;
        }

        public List<ReqCQFolioVS> GetListRequirementCQFolio(SearchFilterReqCQFolio aFilter)
        {
            List<ReqCQFolioRS> list_get = new List<ReqCQFolioRS>();
            List<ReqCQFolioVS> list_return = new List<ReqCQFolioVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqCQFolioVS itemVisual = new ReqCQFolioVS();

            lobj_Filter.UserId = aFilter.intUserId;
            lobj_Filter.strCQFolio = aFilter.strCQFolio;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReqCQFolioRS>("USP_CustomerPortal_REQGetListByCQFolio", SearchFilterMapper.MapReq("CQFolio", lobj_Filter));

            foreach (ReqCQFolioRS item in list_get)
            {
                itemVisual = new ReqCQFolioVS()
                {
                    strSKUEndCustomer = item.strSKUEndCustomer,
                    strUOM = item.strUOM,
                    strCQFolio = item.strREQFolio,
                    strDateRequired = item.dtmCurrentDate.ToString("dd-MMMyyyy  H:mm"),
                    intAdvancePercentage = Decimal.ToInt32(item.intAdvancePercentage),
                    decQtyRequired = Decimal.ToInt32(item.decQuantity),
                    decQtyAllocated = Decimal.ToInt32(item.decQtyAssigned),
                    decQtyNotAllocated = Decimal.ToInt32(item.decPendingQty),
                    intQtyPickeds = Decimal.ToInt32(item.intPicking),
                    decQtyShipped = Decimal.ToInt32(item.decQtyShipped),
                    intInventoryId = Decimal.ToInt32(item.intInventoryId),
                    intShipmentId = Decimal.ToInt32(item.intShipmentId)
                };
                list_return.Add(itemVisual);
            }
            return list_return;
        }

        public List<ReqCQCustomerFolioVS> GetListRequirementCQCustomerFolio(SearchFilterReqCQCustomerFolio aFilter)
        {
            List<ReqCQCustomerFolioRS> list_get = new List<ReqCQCustomerFolioRS>();
            List<ReqCQCustomerFolioVS> list_return = new List<ReqCQCustomerFolioVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqCQCustomerFolioVS itemVisual = new ReqCQCustomerFolioVS();

            lobj_Filter.UserId = aFilter.intUserId;
            lobj_Filter.strCQCustomerFolio = aFilter.strCQCustomerFolio;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReqCQCustomerFolioRS>("USP_CustomerPortal_REQGetListByCQCustomerFolio", SearchFilterMapper.MapReq("CQCustomerFolio", lobj_Filter));

            foreach (ReqCQCustomerFolioRS item in list_get)
            {
                itemVisual = new ReqCQCustomerFolioVS()
                {
                    strSKUEndCustomer = item.strSKUEndCustomer,
                    strUOM = item.strUOM,
                    strCQCustomerFolio = item.strFOLIO,
                    strDateRequired = item.dtmCurrentDate.ToString("dd-MMMyyyy  H:mm"),
                    intAdvancePercentage = Decimal.ToInt32(item.intAdvancePercentage),
                    decQtyRequired = Decimal.ToInt32(item.decQuantity),
                    decQtyAllocated = Decimal.ToInt32(item.decQtyAssigned),
                    decQtyNotAllocated = Decimal.ToInt32(item.decPendingQty),
                    intQtyPickeds = Decimal.ToInt32(item.intPicking),
                    decQtyShipped = Decimal.ToInt32(item.decQtyShipped),
                    intInventoryId = Decimal.ToInt32(item.intInventoryId),
                    intShipmentId = Decimal.ToInt32(item.intShipmentId)
                };
                list_return.Add(itemVisual);
            }
            return list_return;
        }

        public List<ReqSupplierVS> GetListRequirementSupplier(SearchFilterReqSupplier aFilter)
        {
            List<ReqSupplierRS> list_get = new List<ReqSupplierRS>();
            List<ReqSupplierVS> list_return = new List<ReqSupplierVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqSupplierVS itemVisual = new ReqSupplierVS();

            lobj_Filter.UserId = aFilter.intUserId;
            lobj_Filter.strSupplier = aFilter.strSupplier;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReqSupplierRS>("USP_CustomerPortal_REQGetListBySupplier", SearchFilterMapper.MapReq("Supplier", lobj_Filter));

            foreach (ReqSupplierRS item in list_get)
            {
                itemVisual = new ReqSupplierVS()
                {
                    strSKUEndCustomer = item.strSKUEndCustomer,
                    strUOM = item.strUOM,
                    strSupplier = item.strSupplier,
                    intAdvancePercentage = Decimal.ToInt32(item.intAdvancePercentage),
                    decQtyRequired = Decimal.ToInt32(item.decQuantity),
                    decQtyAllocated = Decimal.ToInt32(item.decQtyAssigned),
                    decQtyNotAllocated = Decimal.ToInt32(item.decPendingQty),
                    intQtyPickeds = Decimal.ToInt32(item.intPicking),
                    decQtyShipped = Decimal.ToInt32(item.decQtyShipped),
                    intInventoryId = Decimal.ToInt32(item.intInventoryId),
                    intShipmentId = Decimal.ToInt32(item.intShipmentId)
                };
                list_return.Add(itemVisual);
            }
            return list_return;
        }

        public List<ReqType> GetRequirementTypes()
        {
            return DynamicRepository.All<ReqType>("USP_RequirementTypes_Get", null);
        }

        public List<ReqAutocompleteListVS> GetSKUList(SearchFilterReqSKUList aFilter)
        {
            List<ReqAutocompleteListRS> list_get = new List<ReqAutocompleteListRS>();
            List<ReqAutocompleteListVS> list_return = new List<ReqAutocompleteListVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqAutocompleteListVS itemVisual = new ReqAutocompleteListVS();

            lobj_Filter.intCustomerId = aFilter.intCustomerId;

            list_get = DynamicRepository.All<ReqAutocompleteListRS>("USP_CustomerPortal_REQGetSKUList", SearchFilterMapper.MapReq("List", lobj_Filter));

            foreach (ReqAutocompleteListRS item in list_get)
            {
                itemVisual = new ReqAutocompleteListVS()
                {
                    intId = Decimal.ToInt32(item.Id),
                    strName = item.Name
                };
                list_return.Add(itemVisual);
            }
            return list_return;
        }

        public List<ReqAutocompleteListVS> GetSupplierList(SearchFilterReqSKUList aFilter)
        {
            List<ReqAutocompleteListRS> list_get = new List<ReqAutocompleteListRS>();
            List<ReqAutocompleteListVS> list_return = new List<ReqAutocompleteListVS>();
            SearchReqFilterT lobj_Filter = new SearchReqFilterT();

            ReqAutocompleteListVS itemVisual = new ReqAutocompleteListVS();

            lobj_Filter.intCustomerId = aFilter.intCustomerId;

            list_get = DynamicRepository.All<ReqAutocompleteListRS>("USP_CustomerPortal_REQGetSupplierList", SearchFilterMapper.MapReq("List", lobj_Filter));

            foreach (ReqAutocompleteListRS item in list_get)
            {
                itemVisual = new ReqAutocompleteListVS()
                {
                    intId = Decimal.ToInt32(item.Id),
                    strName = item.Name
                };
                list_return.Add(itemVisual);
            }
            return list_return;
        }

    }
}
