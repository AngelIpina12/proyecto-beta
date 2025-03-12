using System.IO;

namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvBySKUEndCustomerRS
    {
		public string strSKUEndCustomer {  get; set; }
		public int intToltalInvPieces { get; set; }

		public string strUOM { get; set; }

		public string strWayShip { get; set; }
		public int intPallets { get; set; }
		public int intBox { get; set; }
		public int intOnHand { get; set; }
		public int intWOPieces { get; set; }
		public int intPiecesAllocated { get; set; }
		public int intPiecesNotAllocated { get; set; }

		public int intinvid { get; set; }
    }
}
