namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqSupplierVS
    {
        public string strSKUEndCustomer { get; set; }
        public string strUOM { get; set; }
        public string strSupplier { get; set; }
        public decimal intAdvancePercentage { get; set; }
        public decimal decQtyRequired { get; set; }
        public decimal decQtyAllocated { get; set; }
        public decimal decQtyNotAllocated { get; set; }
        public int intQtyPickeds { get; set; }
        public decimal decQtyShipped { get; set; }
        public int intInventoryId { get; set; }
        public int intShipmentId { get; set; }
    }
}
