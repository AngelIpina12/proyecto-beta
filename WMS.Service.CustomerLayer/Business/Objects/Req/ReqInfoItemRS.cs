namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqInfoItemRS
    {
        public DateTime? dtmCurrentDate { get; set; }
        public string strREQFolio { get; set; }

        public string strCustomerFolio { get; set; }

        public decimal intAdvancePercentage { get; set; }
        
    }
}
