namespace WMS.Service.CustomerLayer.Business.Filter.Receive
{
    public class SearchFilterRECSupplierDtm
    {
        public string strSupplierName { get; set; }
        public int intUserId { get; set; }

        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }

    } //class

} // namspace
