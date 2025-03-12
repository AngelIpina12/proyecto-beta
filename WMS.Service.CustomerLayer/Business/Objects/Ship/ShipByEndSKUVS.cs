namespace WMS.Service.CustomerLayer.Business.Objects.Ship
{
    public class ShipByEndSKUVS
    {
        public string strTrailerFolio { get; set; }
        public string strShippedDate { get; set; }
        public string strCQFolio { get; set; }
        public string strCustomerfolio { get; set; }
        public string strSeal { get; set; }
        public int intShipId { get; set; }

        public int intReqId { get; set; }

        public string strSKUEnd { get; set; }
        public string strShipFolio { get; set; }
        public int intPieces { get; set; }

        public string strTrailerNumber { get; set; }
    }
}
