namespace WMS.Service.CustomerLayer.Business.Objects.Ship
{
    public class ShipbySFolioRS
    {
        public string strTrailerFolio { get; set; }
        public DateTime dtmShippedDate { get; set; }
        public string strCQFolio { get; set; }
        public string strCustomerfolio { get; set; }
        public string strShipFolio { get; set; }
        public string strSeal { get; set; }
        public int intShipId { get; set; }

        public int intReqId { get; set; }
    }
}
