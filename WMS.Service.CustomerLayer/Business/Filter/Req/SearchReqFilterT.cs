using System.Data;

namespace WMS.Service.CustomerLayer.Business.Filter.Req
{
    public class SearchReqFilterT
    {
        public int UserId { get; set; }
        public string strReqFolio { get; set; }
        public string strSKUEndCustomer { get; set; }
        public string strCQFolio { get; set; }
        public string strCQCustomerFolio { get; set; }
        public string strSupplier { get; set; }
        public int intCustomerId { get; set; }
        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }
    }
}
