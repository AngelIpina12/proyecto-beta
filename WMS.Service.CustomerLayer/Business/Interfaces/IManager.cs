namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IManager
    {
        IYardManager YardManager { get; set; }
        IUserManager UserManager { get; set; }

        IReceiveManager ReceiveManager { get; set; }
        IDashboardManager DashboardManager { get; set; }
        IReqManager ReqManager { get; set; }
        IInvManager InvManager { get; set; }
        IShipManager ShipManager { get; set; }
        ICatalogManager CatalogManager { get; set; }

        IKPIManager KPIManager { get; set; }
    } //interface 
} //namespace
