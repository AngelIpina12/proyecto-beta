namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceiveItem
    {
        public string strReceinvingFolio { get; set; }
        public DateTime dtmReceivedDate { get; set; }
        public string strSKU { get; set; }
        public string strSupplierName { get; set; }
        public string strWayofShipping { get; set; }
        public decimal decQtyPallets { get; set; }
        public decimal decBoxes { get; set; }
        public decimal intQtyreceivedPieces { get; set; }
        public string strOSD { get; set; }
        public string strTrailerFolio { get; set; }
        public string strEndCustomerName { get; set; }
        public string strStatus { get; set; }

    }//class
}//namespace
