namespace WMS.Service.CustomerLayer.Business.Filter.Req
{
    public class SearchFilterReqCQCustomerFolio
    {
        public int intUserId { get; set; }
        public string strCQCustomerFolio { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
    }
}
