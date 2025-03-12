using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class Manager : IManager
    {

        public IYardManager YardManager { get; set; }
        public IUserManager UserManager { get; set; }

        public IReceiveManager ReceiveManager { get; set; }

        public IReqManager ReqManager { get; set; }
        public IInvManager InvManager { get; set; }

        public IShipManager ShipManager { get; set; }

        public ICatalogManager CatalogManager { get; set; }
        public IDashboardManager DashboardManager { get; set; }

        public IKPIManager KPIManager { get; set; }

        public Manager(IUnitOfWork _unitOfWork, IYardManager _yardManager, IUserManager _userManager, IReceiveManager _receiveManager, IReqManager _reqManager, IInvManager _invmanager, IShipManager _shipmanager, ICatalogManager _catalogManager, IDashboardManager _dashboardManager, IKPIManager _KPIManager)
        {
            AssignYardManager(_unitOfWork, _yardManager);
            AssignUserManager(_unitOfWork, _userManager);
            AssignReceiveManager(_unitOfWork, _receiveManager);
            AssignReqManager(_unitOfWork, _reqManager);
            AssignInvManager(_unitOfWork, _invmanager);
            AssignShipManager(_unitOfWork, _shipmanager);           
            AssignCatManager(_unitOfWork, _catalogManager);
            AssignDashboardManager(_unitOfWork, _dashboardManager);
            AssignKPIManager(_unitOfWork, _KPIManager);

        }

        private void AssignDashboardManager(IUnitOfWork unitOfWork, IDashboardManager dashboardManager)
        {
            DashboardManager = dashboardManager;
            DashboardManager.UnitOfWork = unitOfWork;
            DashboardManager.DynamicRepository.UnitOfWork = unitOfWork;
        }

        public void AssignYardManager(IUnitOfWork _unitOfWork, IYardManager _yardManager)
        {
            YardManager = _yardManager;
            YardManager.UnitOfWork = _unitOfWork;
            YardManager.DynamicRepository.UnitOfWork = _unitOfWork;
        }


        public void AssignUserManager(IUnitOfWork _unitOfWork, IUserManager _userManager)
        {

            UserManager = _userManager;
            UserManager.UnitOfWork = _unitOfWork;
            UserManager.DynamicRepository.UnitOfWork = _unitOfWork;
        }


        public void AssignReceiveManager(IUnitOfWork _unitOfWork, IReceiveManager _receiveManager)
        {
            ReceiveManager =_receiveManager;
            UserManager.UnitOfWork = _unitOfWork;
            UserManager.DynamicRepository.UnitOfWork = _unitOfWork;
        }


        public void AssignReqManager(IUnitOfWork _unitOfWork, IReqManager _reqManager )
        {
            ReqManager = _reqManager;
            ReqManager.UnitOfWork = _unitOfWork;
            ReqManager.DynamicRepository.UnitOfWork= _unitOfWork;

            
        }

        public void AssignInvManager(IUnitOfWork _unitOfWork, IInvManager _invManager)
        {
            
            InvManager = _invManager;
            InvManager.UnitOfWork = _unitOfWork;
            InvManager.DynamicRepository.UnitOfWork= _unitOfWork;



        }

        public void AssignShipManager(IUnitOfWork _unitOfWork, IShipManager _shipmanager)
        {

            ShipManager = _shipmanager;
            ShipManager.UnitOfWork = _unitOfWork;
            ShipManager.DynamicRepository.UnitOfWork = _unitOfWork;



        }

        public void AssignCatManager(IUnitOfWork _unitOfWork,ICatalogManager _catalogManager)
        {

            CatalogManager = _catalogManager;
            CatalogManager.UnitOfWork = _unitOfWork;
            CatalogManager.DynamicRepository.UnitOfWork= _unitOfWork ;


        }

        public void AssignKPIManager(IUnitOfWork _unitOfWork, IKPIManager _KPIManager)
        {
            KPIManager = _KPIManager;
            KPIManager.UnitOfWork = _unitOfWork;
            KPIManager.DynamicRepository.UnitOfWork = _unitOfWork;


        }
    } //class

} // namespace
