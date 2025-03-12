namespace WMS.Service.CustomerLayer.Business.Filter.Ship
{
    public class SearchFilterShUsTrailer
    {

        public int intUserId { get; set; }
        public string strTrailerN { get; set; }
        public DateTime dtmStartDate { get; set; }

        public DateTime dtmEndDate { get; set; }
    }
}
