
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Objects.Inv;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.User;
using System.IO;
using System;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class InvManager : BaseManager, IInvManager
    {

        IServiceProvider _provider { get; set; }

        IInvManager IInvManager.InvManager { get; set; }
        

        public InvManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }

      public   List<InvInfoTodayVS> GetTodayInv(SearchFilterInvA aFilter)
        {

            List<InvInfoTodayRS> list_get = new List<InvInfoTodayRS>();
            List<InvInfoTodayVS> list_return = new List<InvInfoTodayVS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();

            InvInfoTodayVS itemVisual = new InvInfoTodayVS();
            //filtro
            lobj_Filter.intUserId = aFilter.intUserId;
            
            list_get = DynamicRepository.All<InvInfoTodayRS>("USP_CustomerPortal_INVRToday", SearchFilterMapperInv.Map("Today", lobj_Filter));
            // conertir lista 
            foreach (InvInfoTodayRS item in list_get)
            {
                itemVisual = new InvInfoTodayVS()
                {

                    strDtmReceivedDate = item.DtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                    , intBox = item.intBox
                    , intinvid = item.intinvid
                    , intOnHand = item.intOnHand
                    , intPiecesAllocated = item.intPiecesAllocated
                    , intPiecesNotAllocated = item.intPiecesNotAllocated
                    , intPiecesPicked = item.intPiecesPicked    
                    , intPiecesShipped = item.intPiecesShipped
                    ,    intQty = item.intQty
                    , intToltalInvPieces = item.intToltalInvPieces
                    , intWOPieces = item.intWOPieces
                    , strJobNumber = item.strJobNumber
                    ,   strLot = item.strLot
                    , strSKUEndCustomer = item.strSKUEndCustomer
                    , strSKUSupplier = item.strSKUSupplier
                    ,    strUOM = item.strUOM
                    ,    strWayShip = item.strWayShip
                    
                };
                itemVisual.strDtmReceivedDate= itemVisual.strDtmReceivedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        }

        ///
        public List<InvSKUWorkVS> GetSKUInWork(SearchFilterSKUInv aFilter)
        {

            List<InvSKUWorkRS> list_get = new List<InvSKUWorkRS>();
            List<InvSKUWorkVS> list_return = new List<InvSKUWorkVS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            InvSKUWorkVS itemVisual = new InvSKUWorkVS();
            //filtro
            lobj_Filter.intInvId= aFilter.intInvId;
            lobj_Filter.strSKU= aFilter.strSKU;
            lobj_Filter.intUserId = aFilter.intUserId;

            list_get = DynamicRepository.All<InvSKUWorkRS>("USP_CustomerPortal_INVSKUInWork", SearchFilterMapperInv.Map("SKUWork", lobj_Filter));
            // conertir lista 
            foreach (InvSKUWorkRS item in list_get)
            {
                itemVisual = new InvSKUWorkVS()
                {
                     intWorOrderId = item.intWorOrderId
                    ,strdtmStart = item.dtmStart.ToString("dd-MMMyyyy  H:mm")
                    ,strWorkType = item.strWorkType                    
                    ,strSKUEndCustomer = item.strSKUEndCustomer
                    ,strSKUSupplier = item.strSKUSupplier                    
                    ,intTotalPieces = Convert.ToInt32( item.intTotalPieces.ToString())
                    ,strFinalSKU = item.strFinalSKU
                    ,strUOM = item.strUOM
                    ,intQtyFSKUProcees = item.intQtyFSKUProcees
                    ,intQtyPiecesScrap = item.intQtyPiecesScrap

                };
                itemVisual.strdtmStart = itemVisual.strdtmStart.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        }
        ///
        public List<InvSKUAllocateVS> GetSKUAllocated(SearchFilterSKUInv aFilter)        
        {

           List<InvSKUAllocateRS> list_get = new List<InvSKUAllocateRS>();
           List<InvSKUAllocateVS> list_return = new List<InvSKUAllocateVS>();
            
            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            InvSKUAllocateVS itemVisual = new InvSKUAllocateVS();
        //filtro
        
            lobj_Filter.intInvId= aFilter.intInvId;
            lobj_Filter.strSKU= aFilter.strSKU;
            lobj_Filter.intUserId= aFilter.intUserId;

            list_get = DynamicRepository.All<InvSKUAllocateRS>("USP_CustomerPortal_INVSKUAllocated", SearchFilterMapperInv.Map("SKUAlloc", lobj_Filter));
            // conertir lista 
            foreach (InvSKUAllocateRS item in list_get)
            {
                itemVisual = new InvSKUAllocateVS()
                {
                     
                      strSKU = item.strSKU
                     , strUOM = item.strUOMDesc
                     , strWayShipping = item.strWayShipping
                     , stDtmAlloc = item.dtmAlloc.ToString("dd-MMMyyyy  H:mm")
                     ,strCQFolio = item.strCQFolio
                     ,intCustFolio = item.intCustFolio
                     ,intQtyReq = item.intQtyReq
                     ,strinvquality = item.strinvquality
                     ,strReqStatus = item.strReqStatus

                };

                itemVisual.stDtmAlloc =itemVisual.stDtmAlloc.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        }
        ////public List<InvSKUAllocateVS> GetSKUAllocated(SearchFilterSKUInv aFilter);

        //SKUNotAlloc
        public List<InSKUNotAllocatedVS> GetSKUNOTAllocated(SearchFilterSKUInv aFilter)
        {

            List<InSKUNotAllocatedRS> list_get = new List<InSKUNotAllocatedRS>();
            List<InSKUNotAllocatedVS> list_return = new List<InSKUNotAllocatedVS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            InSKUNotAllocatedVS itemVisual = new InSKUNotAllocatedVS();
            //filtro

            lobj_Filter.intInvId = aFilter.intInvId;
            lobj_Filter.strSKU = aFilter.strSKU;
            lobj_Filter.intUserId = aFilter.intUserId;

            list_get = DynamicRepository.All<InSKUNotAllocatedRS>("USP_CustomerPortal_INVSKUNotAllocated", SearchFilterMapperInv.Map("SKUNotAlloc", lobj_Filter));
            // conertir lista 
            foreach (InSKUNotAllocatedRS item in list_get)
            {
                itemVisual = new InSKUNotAllocatedVS()
                {

                    strSKUEndCustomer = item.strSKUEndCustomer,
                    strSupplierName = item.strSupplierName,
                    strQAStatus = item.strQAStatus,
                    strDtmQADate = item.dtmQADate.ToString("dd-MMMyyyy  H:mm") ,
                    intQty = item.intQty
                };

                itemVisual.strDtmQADate = itemVisual.strDtmQADate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        }

    //
        //public List<InvSKUOnHandVS> GetSKUOnHand(SearchFilterSKUInv aFilter);
        public List<InvSKUOnHandVS> GetSKUOnHand(SearchFilterSKUInv aFilter)
        {

            List<InvSKUOnHandRS> list_get = new List<InvSKUOnHandRS>();
            List<InvSKUOnHandVS> list_return = new List<InvSKUOnHandVS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            InvSKUOnHandVS itemVisual = new InvSKUOnHandVS();
            //filtro

            lobj_Filter.intInvId = aFilter.intInvId;
            lobj_Filter.strSKU = aFilter.strSKU;
            lobj_Filter.intUserId = aFilter.intUserId;

            list_get = DynamicRepository.All<InvSKUOnHandRS>("USP_CustomerPortal_INVSKUOnHand", SearchFilterMapperInv.Map("SKUOnHand", lobj_Filter));
            // conertir lista 
            foreach (InvSKUOnHandRS item in list_get)
            {
                itemVisual = new InvSKUOnHandVS()
                {
                    strdtmreceive = item.dtmreceive.ToString("dd-MMMyyyy  H:mm")     ,
                    strSupplierName = item.strSupplierName
                    ,intQty = item.intQty
                    ,strShipUOMInv = item.strShipUOMInv
                    ,intPallets = item.intPallets
                    ,intBoxesxPallets = item.intPallets
                    ,intPiecesxBox = item.intPiecesxBox

                };

                itemVisual.strdtmreceive = itemVisual.strdtmreceive.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        } //public List<InvSKUOnHandVS> GetSKUOnHand(SearchFilterSKUInv aFilter);

        public List<InvBySKUEndCustomerRS> GetInvByEndSKU(SearchFilterSKU aFilter)        
        {

            List<InvBySKUEndCustomerRS> list_get = new List<InvBySKUEndCustomerRS>();            

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();            
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strSKU = aFilter.strSKU;

            list_get = DynamicRepository.All<InvBySKUEndCustomerRS>("USP_CustomerPortal_INVBySKUEnd", SearchFilterMapperInv.Map("EndSKU", lobj_Filter));
            
            
            return list_get;

        }//public List<InvBySKUEndCustomerRS> GetInvByEndSKU(SearchFilterSKU aFilter);

        public List<InvEndCustomerRS> GetInvByEndCustomer(SearchFilterEndCustomer aFilter)
        {
            List<InvEndCustomerRS> list_get = new List<InvEndCustomerRS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strEndCustomer = aFilter.strEndCustomer;

            list_get = DynamicRepository.All<InvEndCustomerRS>("USP_CustomerPortal_INVByEndCustomer", SearchFilterMapperInv.Map("EndCustomer", lobj_Filter));


            return list_get;

        }


        //public List<InvSuppilerSKURS> GetInvBySupplierSKU(SearchFilterSuppSKU aFilter);
        public List<InvSuppilerSKURS> GetInvBySupplierSKU(SearchFilterSuppSKU aFilter)
        {
            List<InvSuppilerSKURS> list_get = new List<InvSuppilerSKURS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strSKU = aFilter.strSupplierSKU;

            list_get = DynamicRepository.All<InvSuppilerSKURS>("USP_CustomerPortal_INVSupSKU", SearchFilterMapperInv.Map("SupSKU", lobj_Filter));


            return list_get;

        }

        //public List<InvBySupplierRS> GetInvBySupplier(SearchFilterSupplier aFilter);
        public List<InvBySupplierRS> GetInvBySupplier(SearchFilterSupplier aFilter)
        {
            List<InvBySupplierRS> list_get = new List<InvBySupplierRS>();

            SearchFilterInvGen lobj_Filter = new SearchFilterInvGen();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strSupplierName = aFilter.strSupplierName;

            list_get = DynamicRepository.All<InvBySupplierRS>("USP_CustomerPortal_INVSupplier", SearchFilterMapperInv.Map("Supplier", lobj_Filter));


            return list_get;

        }

        public List<INVGetSupplierList> GetSupplierList()
        {
            return DynamicRepository.All<INVGetSupplierList>("USP_CustomerPortal_INVGetSupplierList", null);
        }

        //
    } //class

} // namager
