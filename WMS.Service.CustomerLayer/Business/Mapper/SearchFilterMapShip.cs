using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter.Formap;
using WMS.Service.CustomerLayer.Business.Filter;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Filter.Ship;


namespace WMS.Service.CustomerLayer.Business.Mapper
{
    public static class SearchFilterMapShip
    {

        public static dynamic Map(string type, SearchFilterShipGen searchFilter)
        {

            switch (type)
            {
                case "Ship":
                    return new
                    {
                        ShipmentId = searchFilter.intShipId
                    };
                //
                case "TodaySum":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                    };

                case "TodayDetail":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                    };
                case "ReqFolio":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,strReqFolio = searchFilter.strReqFolio
                        ,dtmStartDate = searchFilter.dtmStartDate
                        ,dtmEndDate = searchFilter.dtmEndDate
                    };
                case "Details":
                    return new
                    {
                        ShipmentId = searchFilter.intShipId
                    };

                case "EndCustom":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        strEndCustomer = searchFilter.strEndCustomer
                         ,
                        dtmStartDate = searchFilter.dtmStartDate
                        ,
                        dtmEndDate = searchFilter.dtmEndDate
                    };
                // trailern

                case "Trailern":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        strTrailerN = searchFilter.strTrailerN
                           ,
                        dtmStartDate = searchFilter.dtmStartDate
                        ,
                        dtmEndDate = searchFilter.dtmEndDate
                    };
                //      
                case "skuDet":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        strSKUEndCust = searchFilter.strSKUEndCust
                                   ,
                        dtmStartDate = searchFilter.dtmStartDate
                        ,
                        dtmEndDate = searchFilter.dtmEndDate

                    };
                case "shipfolio":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        strShipFolio = searchFilter.strShipFolio
                                   ,
                        dtmStartDate = searchFilter.dtmStartDate
                        ,
                        dtmEndDate = searchFilter.dtmEndDate

                    };
                    //
            }//  switch (type)
            return null;

        } //public static dynamic Map(string type, SearchFilter searchFilter)

    }
}
