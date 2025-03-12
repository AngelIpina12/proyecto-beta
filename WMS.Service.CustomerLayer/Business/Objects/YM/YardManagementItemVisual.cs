namespace WMS.Service.CustomerLayer.Business.Objects.YM
{
    public class YardManagementItemVisual
    {
        public int Id { get; set; }
        public string DtmRegistrationDate { get; set; }
        public string DtmReceivedDate { get; set; }
        public string strTrailerFolio { get; set; }
        public string strTrailerNumber { get; set; }
        public string strSeal { get; set; }
        public string strCarrierLine { get; set; }
        public string strDriverName { get; set; }
        public string strStatus { get; set; }
        public int intCustomerId { get; set; }
        public int intWareHouseId { get; set; }
    } //YardManagementItemVisual
} //namespace 
