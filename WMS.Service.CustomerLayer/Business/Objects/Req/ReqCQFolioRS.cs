namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqCQFolioRS
    {
        public string strSKUEndCustomer { get; set; }
        public string strUOM { get; set; }
        public string strREQFolio { get; set; }
        public DateTime dtmCurrentDate { get; set; }
        public decimal intAdvancePercentage { get; set; }
        public decimal decQuantity { get; set; }
        public decimal decQtyAssigned { get; set; }
        public decimal decPendingQty { get; set; }
        public int intPicking { get; set; }
        public decimal decQtyShipped { get; set; }
        public int intInventoryId { get; set; }
        public int intShipmentId { get; set; }
    }
}
