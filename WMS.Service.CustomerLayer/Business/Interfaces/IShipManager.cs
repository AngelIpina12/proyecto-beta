
using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Filter.Ship;
using WMS.Service.CustomerLayer.Business.Objects.Req;
using WMS.Service.CustomerLayer.Business.Objects.Ship;
using WMS.Service.CustomerLayer.DAL;


namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IShipManager
    {
        IShipManager ShipManager { get; set; }


        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }

       public  List<ShipPackingRS> GetShipDet(SearchFilterShip aFilter);
       public List<ShipTodaySummaryRS> GetShipTodaySummary(SearchFilterShUser aFilter);

       public List<ShipTodayDetailVS> GetShipTodayDetail(SearchFilterShUser aFilter);

        public List<ShipTodayDetailVS> GetShipDetailByReqFolio(SearchFilterSHUsReqFolio aFilter);

        public List<ShipEndCustomerVS> GetShipDetailByEndCustomer(SearchFilterSHUserECustom aFilter);
        public List<ShipDetailsVS> GetShipDetails(SearchFilterShipDetails aFilter);

        public List<ShipByTrailerNVS> GetShipDetailByTrailerN(SearchFilterShUsTrailer aFilter);

        public List<ShipByEndSKUVS> GetShipByEndSKuCustom(SearchFilterShUsSKUEndC aFilter);

         public List<ShipbySFolioVS> GetShipDetailByShipFolio(SearchFilterSHUsShipFolio aFilter);

    }
}
