namespace WMS.Service.CustomerLayer.Business.Objects.KPI
{
    public class BaseListUsersOptionData
    {
        public int intUserIdAdmin { get; set; }
        
        public List<int>? listUsersIds { get; set; }        
        public string? strUrl { get; set; }
        
    }
}
