namespace WMS.Service.CustomerLayer.Constants
{
    public class WMSServicesException : Exception
    {

        public string StatusCode { get; set; }

        public WMSServicesException(string statusCode = "500") : base(statusCode)
        {
            StatusCode = statusCode;
        }

        public WMSServicesException(Exception ex, string statusCode = "500") : base(statusCode, ex)
        {
            StatusCode = statusCode;
        }

    } //class

} //namespace
