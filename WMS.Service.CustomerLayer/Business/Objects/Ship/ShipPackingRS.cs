namespace WMS.Service.CustomerLayer.Business.Objects.Ship
{
    public class ShipPackingRS
    {
		public string shippinguom {  get; set; }
        public string ProductNumber { get; set; }
		public string TransportationLine { get; set; }
		public string Description { get; set; }
		public string UnloadedName { get; set; }
		public string PedimentoDocNumber { get; set; }

		public string InvoiceDocNumber { get; set; }

		public string WayOfShipping { get; set; }

		public string TotalPieces { get; set; }

		public string ReqFolioStr { get; set; }

		public string SetUpName { get; set; }

		public string CustomerName { get; set; }

    }
}
