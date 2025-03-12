namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InSKUNotAllocatedRS
    {
		public string strSKUEndCustomer {  get; set; }
		public string strSupplierName { get; set; }
		public string strQAStatus { get; set; }
		public DateTime dtmQADate { get; set; }
		public int intQty { get; set; }

    }
}
