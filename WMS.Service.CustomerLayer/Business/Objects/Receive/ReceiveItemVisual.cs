namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceiveItemVisual
    {
        public string strReceinvingFolio { get; set; }
        public string strdtmDate { get; set; }

        public string strSKU { get; set; }
        public string strSupplierName { get; set; }
        public string strWayofShipping { get; set; }
        public int intQtyPallets { get; set; }

        public int intdecBoxes { get; set; }
        public int intQtyreceivedPieces { get; set; }

        public string strOSD { get; set; }
        public string strTrailerFolio { get; set; }

        public string strEndCustomerName { get; set; }

        public string strQtyPalletsBox { get; set; }

        public string strStatus { get; set; }
    } // recoeve

} // namespace 
