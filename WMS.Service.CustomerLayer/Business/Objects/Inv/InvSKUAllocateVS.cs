namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvSKUAllocateVS
    {
		public string strSKU {  get; set; }
		public string strUOM { get; set; }

		public string strWayShipping { get; set; }
		public string  stDtmAlloc { get; set; }
		public string strCQFolio { get; set; }
		public int intCustFolio { get; set; }
		public int intQtyReq { get; set; }
		public string strReqStatus { get; set; }

		public string strinvquality { get; set; }


    }
}
