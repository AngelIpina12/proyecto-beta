namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqDetailRS
    {
        public string strPartNumber { get; set; }
        public string strUOM { get; set; }
        public decimal decQuantity { get; set; }
        public decimal decQtyAssigned { get; set; }
        public decimal decPendingQty { get; set; }
        public int intPicking { get; set; }
        public decimal decQtyShipped { get; set; }
        public int intInventoryId { get; set; }
        public int intShipmentId { get; set; }
    }
}
