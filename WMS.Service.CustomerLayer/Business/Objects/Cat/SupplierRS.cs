namespace WMS.Service.CustomerLayer.Business.Objects.Cat
{
    public class SupplierRS
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int AddressId { get; set; }
        public bool Active { get; set; }
        public string Address { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int StateId { get; set; }
        public string StateName { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public int PostalCodeId { get; set; }
        public string PostalCode { get; set; }
        public int? CustomerId { get; set; } // To add new customer from Iframe directly.
        public string ContactName { get; set; }
        public string PhoneNo { get; set; }
        public string IsActive { get; set; }
        public string Status { get; set; }
    }
}
