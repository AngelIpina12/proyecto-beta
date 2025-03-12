namespace WMS.Service.CustomerLayer.Business.Filter.Receive
{
    public class SearchFilterRECCustomerDtm
    {
        public int intUserId { get; set; }
        public int? intEndCustomerId { get; set; }

        public string? strCustomerName { get; set; }


        public DateTime? dtmStartDate { get; set; }
        public DateTime? dtmEndDate { get; set; }

    } // class
} //namespce
