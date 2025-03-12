namespace WMS.Service.CustomerLayer.Business.Filter
{
    public class WHRestriction
    {
        public int Id { get; set; }
        public int Type { get; set; }//1. User 2.Role 3.Warehouse 4.AdminUser
        public string StrId { get; set; }
    }
} //namespace
