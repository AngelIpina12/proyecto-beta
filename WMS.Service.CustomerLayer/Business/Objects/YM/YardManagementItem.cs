using System.IO;

namespace WMS.Service.CustomerLayer.Business.Objects.YM
{
    public class YardManagementItem
    {
        public int Id { get; set; }
        public DateTime DtmRegistrationDate { get; set; }
        public DateTime DtmReceivedDate { get; set; }
        public string strTrailerFolio { get; set; }
        public string strTrailerNumber { get; set; }
        public string strSeal { get; set; }
        public string strCarrierLine { get; set; }
        public string strDriverName { get; set; }
        public string strStatus { get; set; }
        public int intCustomerId { get; set; }
        public int intWareHouseId { get; set; }
    }//    class YardManagementItem
} // namespace
