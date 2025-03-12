namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceiveInfoDetSKUFolioRS
    {
        public int introwID { get; set; }
        public string strReceinvingFolio { get; set; }

        public string strSKU { get; set; }
        public string strSupplierName { get; set; }
        public string strWayofShipping { get; set; }
        public decimal decQtyPallets { get; set; }
        public decimal decBoxes { get; set; }
        public int intQtyreceivedPieces { get; set; }
        public int intrecid { get; set; }
        public int intinvid { get; set; }
        public int intcustomerprod { get; set; }
        public int intBlindCountId { get; set; }

    } //class

}//namespace
