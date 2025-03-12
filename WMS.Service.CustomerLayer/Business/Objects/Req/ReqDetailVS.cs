namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqDetailVS
    {
        public string strSKUEndCustomer { get; set; }
        public string strUOM { get; set; }
        public int decQtyRequired { get; set; }
        public int decQtyAllocated { get; set; }
        public int decQtyNotAllocated { get; set; }
        public int intQtyPickeds { get; set; }
        public int decQtyShipped { get; set; }
        public int intInventoryId { get; set; }
        public int intShipmentId { get; set; }
    }
}
