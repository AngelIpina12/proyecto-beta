namespace WMS.Service.CustomerLayer.Business.Filter.Ship
{
    public class SearchFilterSHUsReqFolio
    {

        public int intUserId { get; set; }
        public string strReqFolio { get; set; }
        public DateTime dtmStartDate { get; set; }

        public DateTime dtmEndDate { get; set; }
    }
}
