namespace WMS.Service.CustomerLayer.Business.Objects.KPI
{
    public class KpiOptionItemCWRS
    {
		public int intOptionId { get; set; }
		public int intModuleId { get; set; }

		public string strModuleName { get; set; }
        public string strTitle { get; set; }
		public string strLegend { get; set; }
		public string strUrl { get; set; }
		public string strDisplayText { get; set; }
		public int intCustOptionActive { get; set; }
        public int intuserid { get; set; }
		public string strUserId { get; set; }
		public string strUserFullName { get; set; }
		public string strWarehouse { get; set; }
		public int intWarehouseid { get; set; }

        public int intcustomerid { get; set; }
		public string strCustomerName { get; set; }
          
    }
}
