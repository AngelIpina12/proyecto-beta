namespace WMS.Service.CustomerLayer.Business.Objects.Cat
{
    public class EndCustomerRS
    {
        public int Id{ get;set;}

        public string Name{ get;set;}
        public string CustomerCode { get;set;}
        public string CountryName { get;set;}
        public string CityName { get;set;} 
        public string StateName { get;set;}
        public string PostalCode { get;set;}
        public string IMMEXCustomerId { get; set; }

    }
}
