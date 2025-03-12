namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceiveItemCustomerRS
    {
        public int rowId { get; set; }
        public string strReceinvingFolio { get; set; }
        public DateTime dtmReceivedDate { get; set; }

        public string strTrailerFolio { get; set; }

        public string strEndCustomer { get; set; }

        public int intCustomerId { get; set; }
    } //class
}// namespce
