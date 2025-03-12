namespace WMS.Service.CustomerLayer.Business.Filter.Req
{
    public class SearchFilterReqSKUEndCustomer
    {
        public int intUserId { get; set; }
        public string strSKUEndCustomer { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
    }
}
