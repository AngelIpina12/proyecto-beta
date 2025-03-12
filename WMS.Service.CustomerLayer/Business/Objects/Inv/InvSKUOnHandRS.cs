namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvSKUOnHandRS
    {
        public DateTime dtmreceive { get; set; }
        public string strSupplierName { get; set; }
        public int intQty { get; set; }

        public string strShipUOMInv { get; set; }
        public int intPallets { get; set; }
        public int intBoxesxPallets { get; set; }

        public int intPiecesxBox { get; set; }
    }
}
