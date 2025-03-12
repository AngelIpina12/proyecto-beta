namespace WMS.Service.CustomerLayer.Business.Objects.Ship
{
    public class ShipDetailsRS
    {
        public string ProductNumber { get; set; }
        public string Description { get; set; }
        public string EtiqMaster { get; set; }
        public string TransportationLine { get; set; }  
        public string QualityStatus { get; set; }
        public string PickedDate { get; set; }
        public string REQFolioStr { get; set; }
        public string WayOfShipping { get; set; }
        public decimal Quantity { get; set; }
    }
}
