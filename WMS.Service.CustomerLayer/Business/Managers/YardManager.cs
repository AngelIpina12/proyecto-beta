using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Mapper;
using System.IO;
using WMS.Service.CustomerLayer.Business.Filter.YM;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Objects.YM;
//using WMS.Service.CustomerLayer.Business.Filter.User;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class YardManager : BaseManager, IYardManager
    {
       IServiceProvider _provider { get; set; }

        public YardManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }
        //  IYardManager IYardManager.YardManager { get => YardManager.YardManager; set => YardManager.YardManager = value; }

        IYardManager IYardManager.YardManager { get; set; }

        public List<SummaryTrailerDay> GetSummaryTrailerDay(SearchFilterSingleUs asearchFilterUS)
        {            
            return DynamicRepository.All<SummaryTrailerDay>("USP_GetSummaryYardMng", SearchFilterMapper.MapSingle("SingleUs", asearchFilterUS));
        }// getsummarytrailersday

        public List<YardManagementItemVisual> GetYardManagementList(SearchYardMngList asearchFilterYM)
        {
            List<YardManagementItem> list_get = new List<YardManagementItem>();
            List<YardManagementItemVisual> lis_return = new List<YardManagementItemVisual>();
            list_get  =DynamicRepository.All<YardManagementItem>("USP_CustomerPortal_GetYardMngList", SearchFilterMapper.MapYMFilter("YdMngFilter", asearchFilterYM));
            YardManagementItemVisual itemVisual = new YardManagementItemVisual(); ;

            YardManagementItemVisual visualitem = new YardManagementItemVisual();
            foreach (YardManagementItem YmItem in list_get)
            {
                itemVisual = new YardManagementItemVisual()

                
                {
                    Id = YmItem.Id
                    ,
                    DtmRegistrationDate = YmItem.DtmRegistrationDate.ToString("dd-MMMyyyy   H:mm")
                    ,
                    DtmReceivedDate = YmItem.DtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                                       
                    ,
                    intCustomerId = YmItem.intCustomerId
                    ,
                    intWareHouseId = YmItem.intWareHouseId

                };

                if (YmItem.strTrailerFolio != null)
                    itemVisual.strTrailerFolio = YmItem.strTrailerFolio;

                if (YmItem.strTrailerNumber != null)
                    itemVisual.strTrailerNumber = YmItem.strTrailerNumber;

                if (YmItem.strSeal != null)
                    itemVisual.strSeal = YmItem.strSeal;

                if (YmItem.strCarrierLine != null)
                    itemVisual.strCarrierLine = YmItem.strCarrierLine;

                if (YmItem.strDriverName != null)
                    itemVisual.strDriverName = YmItem.strDriverName;

                if (YmItem.strStatus != null)
                    itemVisual.strStatus = YmItem.strStatus;

                itemVisual.DtmReceivedDate = itemVisual.DtmReceivedDate.ToUpper();
                itemVisual.DtmRegistrationDate = itemVisual.DtmRegistrationDate.ToUpper(); ;

                lis_return.Add( itemVisual );
            } // foreach
            return lis_return;

            //return DynamicRepository.All<YardManagementItem>("USP_CustomerPortal_GetYardMngList", SearchFilterMapper.MapYMFilter("YdMngFilter", asearchFilterYM));


        } //YardManagementItem


        public List<TrailerHistoryDataVisual> GetTrailerHistory(SearchFilterFolioTR aTrailerFolio)
        {
            List<TrailerHistoryData> list_Get = new List<TrailerHistoryData>();
            List<TrailerHistoryDataVisual> list_ret = new List<TrailerHistoryDataVisual>();
            TrailerHistoryDataVisual itemVisual;


            list_Get = DynamicRepository.All<TrailerHistoryData>("USP_CustomerPortal_TrailerFolioHistory", SearchFilterMapper.MapTrailerHistory("TrailerFolio", aTrailerFolio));


            foreach (TrailerHistoryData item in list_Get)
            {

                itemVisual = new TrailerHistoryDataVisual()
                {
                    Index = item.Index
                     ,
                    strEvent = item.strEvent
                     ,
                    DtmEventDate = item.DtmEventDate.ToString("dd-MMMyyyy  H:mm").ToUpper()
                    ,
                    intRecTrailerId = item.intRecTrailerId
                    ,
                    intEventId = item.intEventId
                };

                list_ret.Add(itemVisual);

            } //foreach 

            return list_ret;
            // return DynamicRepository.All<TrailerHistoryData>("USP_CustomerPortal_TrailerFolioHistory", SearchFilterMapper.MapTrailerHistory("TrailerFolio", aTrailerFolio));
        } //YardManagementItem


        public List<TrailerStatus> GetTrailerStatusTypes()
        {
          
            return DynamicRepository.All<TrailerStatus>("USP_GetFilterTrailerStatus", null);

        } //YardManagementItem



        public List<ImageItemPath> GetEventImageListPath(SearchImageEvent asearchImageFilter)
        {
            //            return DynamicRepository.All<SummaryTrailerDay>("USP_GetSummaryYardMng", SearchFilterMapper.MapSingle("SingleUs", asearchFilterUS));
            List<ImageItemPath> lrecobj = new List<ImageItemPath>();
            List<ImageItemPath> lreturnobj = new List<ImageItemPath>();
            ImageItemPath lobj_item = new ImageItemPath();
            //string lstr_Path = @"http://localhost/folder/";
            //string lstr_Path = @"/src/assets/";
            string lstr_Path = "";

            string lstr_filename = "";
            lrecobj = DynamicRepository.All<ImageItemPath>("USP_CustomerPortal_GetEventImageListPath", SearchFilterMapper.MapImageEvent("ImageEvent", asearchImageFilter));

            foreach (ImageItemPath item in lrecobj)
            {
                lobj_item = new ImageItemPath();
                lobj_item.intIndex = item.intIndex;
                lobj_item.intPhotoId = item.intPhotoId;
                lobj_item.intPhotoRefId = item.intPhotoRefId;
                lobj_item.intPhotoType = (int)item.intPhotoType;
                lobj_item.strname = item.strPhotoPath;

                lstr_filename = "";
                //if (item.strPhotoPath.IndexOf("01") > -1) lstr_filename = "image1.jpg";
                //else if (item.strPhotoPath.IndexOf("02") > -1) lstr_filename = "image2.jpg";
                //else if (item.strPhotoPath.IndexOf("03") > -1) lstr_filename = "image3.jpg";
                //else if (item.strPhotoPath.IndexOf("04") > -1) lstr_filename = "image4.jpg";
                //else if (item.strPhotoPath.IndexOf("05") > -1) lstr_filename = "image5.jpg";
                //else if (item.strPhotoPath.IndexOf("06") > -1) lstr_filename = "image6.jpg";
                //else if (item.strPhotoPath.IndexOf("07") > -1) lstr_filename = "image7.jpg";
                //else if (item.strPhotoPath.IndexOf("08") > -1) lstr_filename = "image8.jpg";
                //else if (item.strPhotoPath.IndexOf("09") > -1) lstr_filename = "image9.jpg";
                //else lstr_filename = "image10.jpg";
                lobj_item.strPhotoPath = lstr_Path + lstr_filename;

                lreturnobj.Add(lobj_item);

            } // foreach (ImageItemPath item in lrecobj)

            //return DynamicRepository.All<ImageItemPath>("USP_CustomerPortal_GetEventImageListPath", SearchFilterMapper.MapImageEvent("ImageEvent", asearchImageFilter));

            return lreturnobj;
        }


        ///
        public List<FileItemPath> GetEventFileListPath(SearchFileEvent asearchFileFilter)
        {
            //            return DynamicRepository.All<SummaryTrailerDay>("USP_GetSummaryYardMng", SearchFilterMapper.MapSingle("SingleUs", asearchFilterUS));
            List<FileItemPath> lrecobj = new List<FileItemPath>();
            List<FileItemPath> lreturnobj = new List<FileItemPath>();
            FileItemPath lobj_item = new FileItemPath();

            string lstr_Path = @"http://localhost/folder/";
            // string lstr_Path = @"./";

            string lstr_filename = "";
            lrecobj = DynamicRepository.All<FileItemPath>("USP_CustomerPortal_GetEventFileListPath", SearchFilterMapper.MapFileEvent("FileEvent", asearchFileFilter));
            int lint_mod = 0;
            foreach (FileItemPath item in lrecobj)
            {
                lobj_item = new FileItemPath();
                lobj_item.intIndex = item.intIndex;
                lobj_item.intFileId = item.intFileId;
                lobj_item.intFileRefId = item.intFileRefId;
                lobj_item.intFileType = (int)item.intFileType;
                lobj_item.strFileName = item.strFileName;

                lstr_filename = "";
                lint_mod = lobj_item.intIndex % 10;


                if (lint_mod == 0) lstr_filename = "PDF-0.pdf";
                else if (lint_mod == 1) lstr_filename = "PDF-1.pdf";
                else if (lint_mod == 2) lstr_filename = "PDF-2.pdf";
                else if (lint_mod == 3) lstr_filename = "PDF-3.pdf";
                else if (lint_mod == 4) lstr_filename = "PDF-4.pdf";
                else if (lint_mod == 5) lstr_filename = "PDF-5.pdf";
                else if (lint_mod == 6) lstr_filename = "PDF-6.pdf";
                else if (lint_mod == 7) lstr_filename = "PDF-7.pdf";
                else if (lint_mod == 8) lstr_filename = "PDF-8.pdf";
                else if (lint_mod == 9) lstr_filename = "PDF-9.pdf";
                else lstr_filename = "PDF-0.pdf";

                lobj_item.strFilePath = lstr_Path + lstr_filename;

                lreturnobj.Add(lobj_item);

            } // foreach (ImageItemPath item in lrecobj)

            //return DynamicRepository.All<ImageItemPath>("USP_CustomerPortal_GetEventImageListPath", SearchFilterMapper.MapImageEvent("ImageEvent", asearchImageFilter));

            return lreturnobj;

        } //GetEventFileListPath
    } //class

} //namespace
