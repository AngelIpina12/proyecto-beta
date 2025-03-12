namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvSKUWorkVS
    {
		public int intWorOrderId { get; set; }
		public string strWorkType { get; set; }
		public string strdtmStart { get; set; }
		public string  strSKUEndCustomer { get; set; }
		public string strSKUSupplier { get; set; }
        public int intTotalPieces { get; set; }
		public string strUOM { get; set; }
		public string strFinalSKU { get; set; }

		public int intQtyFSKUProcees { get; set; }

		public int intQtyPiecesScrap { get; set; }


    } //class
}
