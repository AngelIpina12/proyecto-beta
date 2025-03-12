namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceiveInfoDetSKUFolioItemVS
    {
        public int introwID { get; set; }

        public string strSKU { get; set; }
        public string strSupplierName { get; set; }
        public string strWayofShipping { get; set; }
        public string strQtyPalletsBox { get; set; }
        public string strQtyreceivedPieces { get; set; }

        public List<ReceivePhotoDamageItemVS> PhotoList { get; set; }
        public List<ReceivePackingListItemVS> PackingList { get; set; }

        //public Byte[] PackingListBytes { get; set; }

    }
}
