namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvBySupplierRS
    {
        public string strSUpplierName {  get; set; }
        public string strSKUSupplier { get; set; }

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
        public string strSKUEndCustomer { get; set; }

    }
}
