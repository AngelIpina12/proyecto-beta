namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvInfoTodayRS
    {
        public string strSKUEndCustomer { get; set; }
        public string strSKUSupplier { get; set; }
        public string strLot { get; set; }

        public string strJobNumber { get; set; }

        public string strWayShip { get; set; }
        public int intQty { get; set; }
        public int intBox { get; set; }
        public int intToltalInvPieces { get; set; }

        public string strUOM { get; set; }
        public int intOnHand { get; set; }
        public int intWOPieces { get; set; }
        public int intPiecesAllocated { get; set; }
        public int intPiecesNotAllocated { get; set; }
        public int intPiecesPicked { get; set; }
        public int intPiecesShipped { get; set; }

        public DateTime DtmReceivedDate { get; set; }
        public int intinvid { get; set; }

    } //clas
}
