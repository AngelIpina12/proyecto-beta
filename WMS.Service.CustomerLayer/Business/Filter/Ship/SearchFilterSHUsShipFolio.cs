namespace WMS.Service.CustomerLayer.Business.Filter.Ship
{
    public class SearchFilterSHUsShipFolio
    {
        public int intUserId { get; set; }
        public string strShipFolio { get; set; }
        public DateTime dtmStartDate { get; set; }

        public DateTime dtmEndDate { get; set; }
    }

}
