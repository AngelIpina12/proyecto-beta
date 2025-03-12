namespace WMS.Service.CustomerLayer.Business.Filter.Receive
{
    public class SearchFilterOpMult
    {
        public int UserId { get; set; }
        public int intIsTrailerFolio { get; set; }
        public string strTrailerFolio { get; set; }
        public int intIsEndCustomer { get; set; }
        public int intEndCustomerId { get; set; }
        public int intIsForSKU { get; set; }
        public string strSKU { get; set; }
        public int intIsSupplier { get; set; }
        public int intSupplierId { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
    }// class
}//nampespace
