namespace WMS.Service.CustomerLayer.Business.Filter.Ship
{
    public class SearchFilterShipGen
    {
        public int intUserId {get; set;}
        public int intShipId {get; set;}

        public string strReqFolio { get; set; }

        public string strEndCustomer { get; set; }

        public string strTrailerN { get; set; }

        public string strSKUEndCust { get; set; }

        public DateTime dtmStartDate { get; set; }

        public DateTime dtmEndDate { get; set; }

        public string strShipFolio { get; set; }
    }
}
