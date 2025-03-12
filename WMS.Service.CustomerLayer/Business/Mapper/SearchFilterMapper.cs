using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter;
using WMS.Service.CustomerLayer.Business.Filter.Dashboard;
using WMS.Service.CustomerLayer.Business.Filter.Formap;
using WMS.Service.CustomerLayer.Business.Filter.KPI;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Filter.User;

using WMS.Service.CustomerLayer.Business.Filter.YM;

namespace WMS.Service.CustomerLayer.Business.Mapper
{
    public static class SearchFilterMapper
    {
        public static dynamic Map(string type, SearchFilter searchFilter)
        {

            switch (type)
            {
                case "Customer":
                    return new
                    {
                        CustomerIds = CustomDataTableExtensions.ToDataTable<int>(searchFilter.CustomerIds, "Id"),
                        Addressid = searchFilter.AddressId,
                        ResultCount = searchFilter.ResultCount == 0 ? 300 : searchFilter.ResultCount,
                        WhRes = CustomDataTableExtensions.ToDataTable<WHRestriction>(searchFilter.WHRes, new string[] { "Id", "Type", "StrId" }),
                        Type = searchFilter.Type
                    };

                case "Transportations":
                    return new
                    {
                        Id = searchFilter.Id,
                        Active = searchFilter.SearchStatus,
                        ResultCount = searchFilter.ResultCount == 0 ? 300 : searchFilter.ResultCount
                    };
                case "TransportationLines":
                    return new
                    {
                        Id = searchFilter.Id,
                        Active = searchFilter.SearchStatus,
                        ResultCount = searchFilter.ResultCount == 0 ? 300 : searchFilter.ResultCount
                    };
                case "Trailers":
                    return new
                    {
                        Folio = searchFilter.Id,
                        Trailer = searchFilter.ReqFolio,
                        TransportationLine = searchFilter.TransportationLineId,
                        FromDate = searchFilter.StartTime,
                        ToDate = searchFilter.FinalTime,
                        ViewType = searchFilter.ViewType,
                        Status = searchFilter.SearchStatus,
                        PageType = searchFilter.PageType,
                        UserId = searchFilter.UserId,
                        TrailerIds = CustomDataTableExtensions.ToDataTable<int>(searchFilter.TrailerIds, "Id"),
                        WhRes = CustomDataTableExtensions.ToDataTable<WHRestriction>(searchFilter.WHRes, new string[] { "Id", "Type", "StrId" })
                    };

                case "Users":
                    return new
                    {
                        Id = searchFilter.Id,
                        AddressId = searchFilter.AddressId,
                        RoleIds = CustomDataTableExtensions.ToDataTable<int>(searchFilter.RoleIds, "Id"),
                        Email = searchFilter.Email,
                        Phone = searchFilter.Phone,
                        WhRes = CustomDataTableExtensions.ToDataTable<WHRestriction>(searchFilter.WHRes, new string[] { "Id", "Type", "StrId" }),
                        Type = searchFilter.Type
                    };

                case "CrossdockDetails":
                    return new
                    {
                        CqCustomerId = searchFilter.CQCustomerId,
                        CustomerIds = CustomDataTableExtensions.ToDataTable<int>(searchFilter.CustomerIds, "Id"),
                        FolioType = searchFilter.FolioType,
                        MaximumQty = searchFilter.MaximumQty,
                        WillBeWeighted = searchFilter.AutomaticCalculate,
                        WhRes = CustomDataTableExtensions.ToDataTable<WHRestriction>(searchFilter.WHRes, new string[] { "Id", "Type", "StrId" }),
                        Type = searchFilter.ViewType,
                        ReqFolio = searchFilter.filterText
                    };

            }//  switch (type)
            return null;

        } //public static dynamic Map(string type, SearchFilter searchFilter)

        public static dynamic MapSingle(string type, SearchFilterSingleUs aSingleUs)
        {

            switch (type)
            {
                case "SingleUs":
                    return new
                    {
                        UserId = aSingleUs.UserId,
                    };


            } //swuitch
            return null;
        }// mapssingle

        public static dynamic MapYMFilter(string type, SearchYardMngList aFilter)
        {
            switch (type)
            {
                case "YdMngFilter":
                    return new
                    {

                        UserId = aFilter.userId
                        ,
                        intIsToday = aFilter.intIsToday
                        ,
                        intIsTrailerFolio = aFilter.intIsTrailerFolio
                        ,
                        strTrailerFolio = aFilter.strTrailerFolio
                        ,
                        intIsRangeDate = aFilter.intIsRangeDate
                        ,
                        dtmStartDate = aFilter.dtmStartDate
                        ,
                        dtmEndDate = aFilter.dtmEndDate
                        ,
                        intIsTrailerNumber = aFilter.intIsTrailerNumber
                        ,
                        strTrailerNumber = aFilter.strTrailerNumber
                        ,
                        intStatusId = aFilter.intStatusId
                        ,
                        strStatusVal = aFilter.strStatusVal
                    };
            } //swuitch
            return null;
        } //MapYMFilter


        public static dynamic MapUSDataFilter(string type, SearchFilterUserData aFilterUSData)
        {
            switch (type)
            {
                case "UserDataFilter":
                    return new
                    {
                        UserId = aFilterUSData.UserId,
                        UserName = aFilterUSData.UserName,
                        PWD = aFilterUSData.PWD,
                        Type = aFilterUSData.Type
                    };
            } // switch
            return null;

        } //public static dynamic MapUSDataFilter()

        public static dynamic MapTrailerHistory(string type, SearchFilterFolioTR aTrailerFolio)
        {

            switch (type)
            {
                case "TrailerFolio":
                    return new
                    {
                        strFolio = aTrailerFolio.strFolio,
                    };


            } //swuitch
            return null;
        }// mapssingle


        public static dynamic MapImageEvent(string type, SearchImageEvent aImageEvent)
        {
            switch (type)
            {
                case "ImageEvent":
                    return new
                    {
                        aintEventId = aImageEvent.aintEventId,
                        aintTrailerId = aImageEvent.aintTrailerId,
                        astrEventName = aImageEvent.astrEventName
                    };

            } //swuitch
            return null;

        }

        public static dynamic MapFileEvent(string type, SearchFileEvent aFileEvent)
        {
            switch (type)
            {
                case "FileEvent":
                    return new
                    {
                        aintEventId = aFileEvent.aintEventId,
                        aintTrailerId = aFileEvent.aintTrailerId,
                        astrEventName = aFileEvent.astrEventName
                    };

            } //swuitch
            return null;

        }
        public static dynamic MapReception(string type, SearchFilterReception aReception)
        {
            switch (type)
            {
                case "Today":
                    return new
                    {
                        UserId = aReception.UserId

                    };
                case "RECFolio":
                    return new
                    {
                        strRECFolio = aReception.strRECFolio

                    };
                case "RECByCustomDate":
                    return new
                    {
                        strCustomerName = aReception.strCustomerName
                        ,
                        intUserId = aReception.UserId
                        ,
                        intCustomerId = aReception.intEndCustomerId
                        ,
                        dtmStartDate = aReception.dtmStartDate
                         ,
                        dtmEndDate = aReception.dtmEndDate
                    };
                case "RECBySKUDate":
                    return new
                    {
                        strSKU = aReception.strSKU
                        ,
                        intUserId = aReception.UserId
                        ,
                        dtmStartDate = aReception.dtmStartDate
                        ,
                        dtmEndDate = aReception.dtmEndDate
                    };

                case "RECBySupplierDate":
                    return new
                    {
                        strSupplierName = aReception.strSupplierName
                        , intUserId = aReception.UserId
                        , intSupplierId = 0
                        , dtmStartDate = aReception.dtmStartDate
                        ,dtmEndDate = aReception.dtmEndDate

                    };
                case "OtherOptions":
                    return new
                    {
                        UserId = aReception.UserId,
                        intIsToday = 0,
                        intIsTrailerFolio = aReception.intIsTrailerFolio,
                        strTrailerFolio = aReception.strTrailerFolio,
                        intIsEndCustomer = aReception.intIsEndCustomer,
                        intEndCustomerId = aReception.intEndCustomerId,
                        intIsForSKU = aReception.intIsForSKU,
                        strSKU = aReception.strSKU,
                        intIsSupplier = aReception.intIsSupplier,
                        intSupplierId = aReception.intSupplierId,
                        dtmStartDate = aReception.dtmStartDate,
                        dtmEndDate = aReception.dtmEndDate

                    };
            }
            return null;
        }

        public static dynamic MapReceptionDetailFSKU(string type, SearchFilterRecepDetailFSKUBC aReception)
        {
            switch (type)
            {
                case "HeadREC":
                    return new
                    {
                        strRECFolio = aReception.strRECFolio

                    };
                case "DetSKUREC":
                    return new
                    {
                        strRECFolio = aReception.strRECFolio
                        ,
                        @strSKU = aReception.strSKU

                    };
                case "BlindCountFPhoto":
                    return new
                    {
                        intBlindCountId = aReception.intBlindCountId
                    };
                case "BlindCountPackingRECEP":
                    return new
                    {
                        intBlindCountId = aReception.intBlindCountId
                    };
            }

            return null;
        } //public static dynamic MapReceptionDetailFSKU(string type, SearchFilterRecepDetailFSKUBC aReception)

        public static dynamic MapCatalogFilter(string type, SearchFilterCatalog aCATFilter)
        {
            switch (type)
            {
                case "EndCustomer":
                    return new
                    {
                        strCustomerName = aCATFilter.strFilter

                    };
            }

            return null;
        } //public static dynamic MapReceptionDetailFSKU(string type, SearchFilterRecepDetailFSKUBC aReception)

        //
        public static dynamic MapReq(string type, SearchReqFilterT aReq)
        {
            switch (type)
            {
                case "Today":
                    return new
                    {
                        UserId = aReq.UserId

                    };
                case "Details":
                    return new
                    {
                        strReqFolio = aReq.strReqFolio
                    };
                case "SKUEndCustomer":
                    return new
                    {
                        intUserId = aReq.UserId,
                        strSKUEndCustomer = aReq.strSKUEndCustomer,
                        dtmStartDate = aReq.dtmStartDate,
                        dtmEndDate = aReq.dtmEndDate
                    };
                case "CQFolio":
                    return new
                    {
                        intUserId = aReq.UserId,
                        strCQFolio = aReq.strCQFolio,
                        dtmStartDate = aReq.dtmStartDate,
                        dtmEndDate = aReq.dtmEndDate
                    };
                case "CQCustomerFolio":
                    return new
                    {
                        intUserId = aReq.UserId,
                        strCQCustomerFolio = aReq.strCQCustomerFolio,
                        dtmStartDate = aReq.dtmStartDate,
                        dtmEndDate = aReq.dtmEndDate
                    };
                case "Supplier":
                    return new
                    {
                        intUserId = aReq.UserId,
                        strSupplier = aReq.strSupplier,
                        dtmStartDate = aReq.dtmStartDate,
                        dtmEndDate = aReq.dtmEndDate
                    };
                case "List":
                    return new
                    {
                        CustomerId = aReq.intCustomerId,
                    };
            }
            return null;
        }

        //
        public static dynamic MapKPI(string type, SearchKPIFilter aFilter)
        {
            switch (type)
            {
                case "user":
                    return new
                    {
                        UserId = aFilter.intUserId
                    };

            } //swuitch
            return null;

        }

        public static dynamic MapKPIUserWC(string type, FilterSearchUserWC aFilter)
        {
            switch (type)
            {
                case "userWC":
                    return new
                    {
                        UserId = aFilter.intUserId
                        ,intWareHouseId = aFilter.intWareHouseId
                        ,intCustomerId = aFilter.intCustomerId
                    };
                case "WC":
                    return new
                    {

                        intWarehouseid = aFilter.intWareHouseId
                        ,
                        intCustomerid = aFilter.intCustomerId
                    };

            } //swuitch
            return null;

        }
        public static dynamic MapCustomerAndWareHouse(string type, CustomerFilterW aFilter)
        {
            switch (type)
            {
                case "warehouse":
                    return new
                    {
                        UserId = aFilter.intUserId
                        ,intWareHouseid = aFilter.intWareHouseid

                    };

            } //swuitch
            return null;

        }
    }//class

} //namespace
