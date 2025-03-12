namespace WMS.Service.CustomerLayer.Business.Filter.YM
{
    public class SearchYardMngList
    {
        public int userId { get; set; }
        public int intIsToday { get; set; }
        public int intIsTrailerFolio { get; set; }
        public string strTrailerFolio { get; set; }
        public int intIsRangeDate { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
        public int intIsTrailerNumber { get; set; }
        public string strTrailerNumber { get; set; }
        public int intStatusId { get; set; }

        public string strStatusVal { get; set; }

    } //class SearchYardMngList

    public class SearchYardMngListA
    {
        public int userId { get; set; }
        public int intIsToday { get; set; }
        public int intIsTrailerFolio { get; set; }
        public string strTrailerFolio { get; set; }
        public int intIsRangeDate { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }

    } //class SearchYardMngListA


} // namspace
