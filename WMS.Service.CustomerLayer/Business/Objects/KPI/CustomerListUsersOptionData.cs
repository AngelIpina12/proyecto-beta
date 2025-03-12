namespace WMS.Service.CustomerLayer.Business.Objects.KPI
{
    public class CustomerListUsersOptionData
    {
        public int intUserIdAdmin { get; set; }
        public int intOptionId { get; set; }

        public int intModuleId { get; set; }      

        public List<int>? listUsersIds { get; set; }
        public string? strTitle { get; set; }

        public string? strLegend { get; set; }

        public string? strUrl { get; set; }
        public int intActive { get; set; }
    }
}
