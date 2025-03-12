using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Filter.YM;
//using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Objects.YM;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IYardManager
    {
        IYardManager YardManager { get; set; }


        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }
        List<SummaryTrailerDay> GetSummaryTrailerDay(SearchFilterSingleUs asearchFilterUS);

        List<YardManagementItemVisual> GetYardManagementList(SearchYardMngList asearchFilterYM);

        List<TrailerHistoryDataVisual> GetTrailerHistory(SearchFilterFolioTR aTrailerFolio);

        List<TrailerStatus> GetTrailerStatusTypes();

        List<ImageItemPath> GetEventImageListPath(SearchImageEvent asearchImageFilter);

        List<FileItemPath> GetEventFileListPath(SearchFileEvent asearchFileFilter);


    } //interface

} //namspace
