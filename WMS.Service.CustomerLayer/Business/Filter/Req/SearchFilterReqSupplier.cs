namespace WMS.Service.CustomerLayer.Business.Filter.Req
{
    public class SearchFilterReqSupplier
    {
        public int intUserId { get; set; }
        public string strSupplier { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
    }
}
