namespace WMS.Service.CustomerLayer.Business.Filter.Req
{
    public class SearchFilterReqCQFolio
    {
        public int intUserId { get; set; }
        public string strCQFolio { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
    }
}
