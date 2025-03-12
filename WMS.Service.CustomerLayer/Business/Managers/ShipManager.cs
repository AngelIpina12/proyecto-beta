
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Interfaces;

using System.IO;
using System;
using WMS.Service.CustomerLayer.Business.Filter.Ship;
using WMS.Service.CustomerLayer.Business.Objects.Ship;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Objects.Inv;


namespace WMS.Service.CustomerLayer.Business.Managers
{

    public class ShipManager : BaseManager, IShipManager
    {

        IServiceProvider _provider { get; set; }

        IShipManager IShipManager.ShipManager { get; set; }



        public ShipManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }


        public List<ShipPackingRS> GetShipDet(SearchFilterShip aFilter)
        {
            List<ShipPackingRS> list_get = new List<ShipPackingRS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            //filtro

            lobj_Filter.intShipId = aFilter.intShip;

            list_get = DynamicRepository.All<ShipPackingRS>("USP_CustomerPortal_SHIGetShipmentDetails", SearchFilterMapShip.Map("Ship", lobj_Filter));


            return list_get;

        }


        public List<ShipTodaySummaryRS> GetShipTodaySummary(SearchFilterShUser aFilter)
        {
            List<ShipTodaySummaryRS> list_get = new List<ShipTodaySummaryRS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;

            list_get = DynamicRepository.All<ShipTodaySummaryRS>("USP_CustomerPortal_SHIPTodaySummary", SearchFilterMapShip.Map("TodaySum", lobj_Filter));


            return list_get;

        }

        //GetShipTodaySummary
        //        public List<ShipTodayDetailVS> GetShipTodayDetail(SearchFilterShUser aFilter);

        public List<ShipTodayDetailVS> GetShipTodayDetail(SearchFilterShUser aFilter)
        {

            List<ShipTodayDetailRS> list_get = new List<ShipTodayDetailRS>();
            List<ShipTodayDetailVS> list_return = new List<ShipTodayDetailVS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipTodayDetailVS itemVisual = new ShipTodayDetailVS();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;

            list_get = DynamicRepository.All<ShipTodayDetailRS>("USP_CustomerPortal_SHIPTodayDetail", SearchFilterMapShip.Map("TodayDetail", lobj_Filter));
            // conertir lista 
            foreach (ShipTodayDetailRS item in list_get)
            {
                itemVisual = new ShipTodayDetailVS()
                {
                    strShippedDate = item.dtmShippedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strTrailerFolio = item.strTrailerFolio
                    ,
                    strCQFolio = item.strCQFolio
                    ,
                    strCustomerfolio = item.strCustomerfolio
                    ,
                    strShipFolio = item.strShipFolio
                    ,
                    strSeal = item.strSeal

                    ,
                    intReqId = item.intReqId
                    ,
                    intShipId = item.intShipId

                };

                itemVisual.strShippedDate = itemVisual.strShippedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        } // funcion


        // 
        public  List<ShipTodayDetailVS> GetShipDetailByReqFolio(SearchFilterSHUsReqFolio aFilter)
        {

            List<ShipTodayDetailRS> list_get = new List<ShipTodayDetailRS>();
            List<ShipTodayDetailVS> list_return = new List<ShipTodayDetailVS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipTodayDetailVS itemVisual = new ShipTodayDetailVS();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strReqFolio = aFilter.strReqFolio;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ShipTodayDetailRS>("USP_CustomerPortal_SHIPTDetailByReqFolio", SearchFilterMapShip.Map("ReqFolio", lobj_Filter));
            // conertir lista 
            foreach (ShipTodayDetailRS item in list_get)
            {
                itemVisual = new ShipTodayDetailVS()
                {
                    strShippedDate = item.dtmShippedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strTrailerFolio = item.strTrailerFolio
                    ,
                    strCQFolio = item.strCQFolio
                    ,
                    strCustomerfolio = item.strCustomerfolio
                    ,
                    strShipFolio = item.strShipFolio
                    ,
                    strSeal = item.strSeal

                    ,
                    intReqId = item.intReqId
                    ,
                    intShipId = item.intShipId

                };

                itemVisual.strShippedDate = itemVisual.strShippedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        }
        // GetShipTodDetail
        // 
        public List<ShipEndCustomerVS> GetShipDetailByEndCustomer(SearchFilterSHUserECustom aFilter)
        {

            List<ShipEndCustomerRS> list_get = new List<ShipEndCustomerRS>();
            List<ShipEndCustomerVS> list_return = new List<ShipEndCustomerVS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipEndCustomerVS itemVisual = new ShipEndCustomerVS();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strEndCustomer = aFilter.strEndCustomer;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ShipEndCustomerRS>("USP_CustomerPortal_SHIPTDetailByEndCustom", SearchFilterMapShip.Map("EndCustom", lobj_Filter));
            // conertir lista 
            foreach (ShipEndCustomerRS item in list_get)
            {
                itemVisual = new ShipEndCustomerVS()
                {
                    strShippedDate = item.dtmShippedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strTrailerFolio = item.strTrailerFolio
                    ,
                    strCQFolio = item.strCQFolio
                    ,
                    strCustomerfolio = item.strCustomerfolio
                    ,
                    strShipFolio = item.strShipFolio
                    ,
                    strSeal = item.strSeal

                    ,
                    intReqId = item.intReqId
                    ,
                    intShipId = item.intShipId

                    , strEndCustomer = item.strEndCustomer
                };

                itemVisual.strShippedDate = itemVisual.strShippedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        }

        //GetShipDetailByEndCus



        public List<ShipDetailsVS> GetShipDetails(SearchFilterShipDetails aFilter)
        {
            List<ShipDetailsRS> list_get = new List<ShipDetailsRS>();
            List<ShipDetailsVS> list_return = new List<ShipDetailsVS>();
            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipDetailsVS itemVisual = new ShipDetailsVS();

            lobj_Filter.intShipId = aFilter.intShipmentId;

            list_get = DynamicRepository.All<ShipDetailsRS>("USP_CustomerPortal_SHIGetShipmentDetails", SearchFilterMapShip.Map("Details", lobj_Filter));

            foreach (ShipDetailsRS item in list_get)
            {
                itemVisual = new ShipDetailsVS()
                {
                    strSKU = item.ProductNumber,
                    strDescription = item.Description,
                    strEtiqMaster = item.EtiqMaster,
                    strTransportLine = item.TransportationLine,
                    strQualityStatus = item.QualityStatus,
                    strDate = item.PickedDate,
                    strRequirementFolio = item.REQFolioStr,
                    strWayOfShipping = item.WayOfShipping,
                    strShippedQty = Decimal.ToInt32(item.Quantity)
                };
                list_return.Add(itemVisual);
            }

            return list_return;

        }

        // public GetShipTodDetail
        // 
        public List<ShipByTrailerNVS> GetShipDetailByTrailerN(SearchFilterShUsTrailer aFilter)
        {

            List<ShipByTrailerNRS> list_get = new List<ShipByTrailerNRS>();
            List<ShipByTrailerNVS> list_return = new List<ShipByTrailerNVS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipByTrailerNVS itemVisual = new ShipByTrailerNVS();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strTrailerN = aFilter.strTrailerN;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;


            list_get = DynamicRepository.All<ShipByTrailerNRS>("USP_CustomerPortal_SHIPTDetailByTrailerN", SearchFilterMapShip.Map("Trailern", lobj_Filter));
            // conertir lista 
            foreach (ShipByTrailerNRS item in list_get)
            {
                itemVisual = new ShipByTrailerNVS()
                {
                    strShippedDate = item.dtmShippedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strTrailerFolio = item.strTrailerFolio
                    ,
                    strCQFolio = item.strCQFolio
                    ,
                    strCustomerfolio = item.strCustomerfolio
                    ,
                    strShipFolio = item.strShipFolio
                    ,
                    strSeal = item.strSeal

                    ,
                    intReqId = item.intReqId
                    ,
                    intShipId = item.intShipId
                    , strTrailerNumber = item.strTrailerNumber
                };

                itemVisual.strShippedDate = itemVisual.strShippedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        }
        //GetShipDetailByTrailerN

        //skuDet
        public List<ShipByEndSKUVS> GetShipByEndSKuCustom(SearchFilterShUsSKUEndC aFilter)
        {

            List<ShipByEndSKURS> list_get = new List<ShipByEndSKURS>();
            List<ShipByEndSKUVS> list_return = new List<ShipByEndSKUVS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipByEndSKUVS itemVisual = new ShipByEndSKUVS();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strSKUEndCust = aFilter.strSKUEndCust;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;

            list_get = DynamicRepository.All<ShipByEndSKURS>("USP_CustomerPortal_SHIPTDetailByEndSKuCustom", SearchFilterMapShip.Map("skuDet", lobj_Filter));
            // conertir lista 
            foreach (ShipByEndSKURS item in list_get)
            {
                itemVisual = new ShipByEndSKUVS()
                {
                    strShippedDate = item.dtmShippedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strTrailerFolio = item.strTrailerFolio
                    ,
                    strCQFolio = item.strCQFolio
                    ,
                    strCustomerfolio = item.strCustomerfolio
                    ,
                    strShipFolio = item.strShipFolio
                    ,
                    strSeal = item.strSeal

                    ,
                    intReqId = item.intReqId
                    ,
                    intShipId = item.intShipId
                    ,strSKUEnd = item.strSKUEnd
                    , intPieces = item.intPieces
                    ,
                    strTrailerNumber = item.strTrailerNumber

                };

                itemVisual.strShippedDate = itemVisual.strShippedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        }

       public List<ShipbySFolioVS> GetShipDetailByShipFolio(SearchFilterSHUsShipFolio aFilter)
        {

            List<ShipbySFolioRS> list_get = new List<ShipbySFolioRS>();
            List<ShipbySFolioVS> list_return = new List<ShipbySFolioVS>();

            SearchFilterShipGen lobj_Filter = new SearchFilterShipGen();

            ShipbySFolioVS itemVisual = new ShipbySFolioVS();
            //filtro

            lobj_Filter.intUserId = aFilter.intUserId;
            lobj_Filter.strShipFolio= aFilter.strShipFolio;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ShipbySFolioRS>("USP_CustomerPortal_SHIPTDetailByShipFolio", SearchFilterMapShip.Map("shipfolio", lobj_Filter));
            // conertir lista 
            foreach (ShipbySFolioRS item in list_get)
            {
                itemVisual = new ShipbySFolioVS()
                {
                    strShippedDate = item.dtmShippedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strTrailerFolio = item.strTrailerFolio
                    ,
                    strCQFolio = item.strCQFolio
                    ,
                    strCustomerfolio = item.strCustomerfolio
                    ,
                    strShipFolio = item.strShipFolio
                    ,
                    strSeal = item.strSeal

                    ,
                    intReqId = item.intReqId
                    ,
                    intShipId = item.intShipId

                };

                itemVisual.strShippedDate = itemVisual.strShippedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        }
        //
    } // class


} ///namespace

