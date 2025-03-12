using System.Data.SqlTypes;
using System.Reflection.Metadata.Ecma335;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.User;
//using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Filter.Formap;
using WMS.Service.CustomerLayer.Business.Objects.Receive;
using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Mapper;
using WMS.Service.CustomerLayer.Business.Filter.Req;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class ReceiveManager : BaseManager, IReceiveManager
    {
        IServiceProvider _provider { get; set; }

        IReceiveManager IReceiveManager.ReceiveManager { get; set; }

        public ReceiveManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;
        }
        //public ReceiveManager(IDynamicRepository _dynamicRepository, IServiceProvider provider)

        public List<ReceiveTodayItemVisual> GetTodayReceiveList(SearchFilterSingleUs aSearchFilterSingleUs)
        {
            List<ReceiveTodayItem> list_get = new List<ReceiveTodayItem>();
            List<ReceiveTodayItemVisual> list_return = new List<ReceiveTodayItemVisual>();
            SearchFilterReception lobj_Filter = new SearchFilterReception();

            ReceiveTodayItemVisual itemVisual = new ReceiveTodayItemVisual();
            //filtro
            lobj_Filter.dtmStartDate = null;
            lobj_Filter.dtmEndDate = null;
            lobj_Filter.UserId = aSearchFilterSingleUs.UserId;

            list_get = DynamicRepository.All<ReceiveTodayItem>("USP_CustomerPortal_RECGetToday", SearchFilterMapper.MapReception("Today", lobj_Filter));
            // conertir lista 
            foreach (ReceiveTodayItem item in list_get)
            {
                itemVisual = new ReceiveTodayItemVisual()
                {
                    strDateTime = item.dtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                    ,
                    strRecFolio = item.strReceinvingFolio
                    ,
                    strTrailerFolio = item.strTrailerFolio
                };
                itemVisual.strDateTime = itemVisual.strDateTime.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;

        }

        public List<ReceiveItemVisual> GetReceiveFilterList(SearchFilterOpMult aFilter)
        {
            List<ReceiveItem> list_get = new List<ReceiveItem>();
            List<ReceiveItemVisual> list_return = new List<ReceiveItemVisual>();
            SearchFilterReception lobj_Filter = new SearchFilterReception();

            ReceiveItemVisual itemVisual = new ReceiveItemVisual();
            //filtro

            lobj_Filter.UserId = aFilter.UserId;

            lobj_Filter.intIsTrailerFolio = aFilter.intIsTrailerFolio;
            lobj_Filter.strTrailerFolio = aFilter.strTrailerFolio;

            lobj_Filter.intIsEndCustomer = aFilter.intIsEndCustomer;
            lobj_Filter.intEndCustomerId = aFilter.intEndCustomerId;

            lobj_Filter.intIsForSKU = aFilter.intIsForSKU;
            lobj_Filter.strSKU = aFilter.strSKU;

            lobj_Filter.intSupplierId = aFilter.intSupplierId;
            lobj_Filter.intIsSupplier = aFilter.intIsSupplier;

            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            lobj_Filter.intIsToday = 0;

            list_get = DynamicRepository.All<ReceiveItem>("USP_CustomerPortal_GetReceivesList", SearchFilterMapper.MapReception("OtherOptions", lobj_Filter));
            // conertir lista 
            foreach (ReceiveItem item in list_get)
            {
                itemVisual = new ReceiveItemVisual()
                {
                    strReceinvingFolio = item.strReceinvingFolio
                     ,
                    strdtmDate = item.dtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                     ,
                    strSKU = item.strSKU
                     ,
                    strSupplierName = item.strSupplierName
                     ,
                    strWayofShipping = item.strWayofShipping
                     ,
                    intQtyPallets = Decimal.ToInt32(item.intQtyreceivedPieces)
                     ,
                    intdecBoxes = Decimal.ToInt32(item.decBoxes)
                     ,
                    intQtyreceivedPieces = Decimal.ToInt32(item.intQtyreceivedPieces)
                     ,
                    strOSD = item.strOSD
                     ,
                    strEndCustomerName = item.strEndCustomerName
                  ,
                    strQtyPalletsBox = Convert.ToInt32((Decimal)item.decQtyPallets).ToString() + "/" + Convert.ToInt32(item.decBoxes).ToString().ToString()

                    ,
                    strStatus = item.strStatus
                };
                itemVisual.strdtmDate = itemVisual.strdtmDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        } //GetReceiveFilterList


        public List<ReceiveItemVisual> GetReceiveListByRecFolio(SearchFilterRECFolio aFilter)
        {
            List<ReceiveItem> list_get = new List<ReceiveItem>();
            List<ReceiveItemVisual> list_return = new List<ReceiveItemVisual>();
            SearchFilterReception lobj_Filter = new SearchFilterReception();

            ReceiveItemVisual itemVisual = new ReceiveItemVisual();
            //filtro

            lobj_Filter.strRECFolio = aFilter.strRECFolio;

            list_get = DynamicRepository.All<ReceiveItem>("USP_CustomerPortal_RECGetListbyRecFolio", SearchFilterMapper.MapReception("RECFolio", lobj_Filter));
            // conertir lista 
            foreach (ReceiveItem item in list_get)
            {
                itemVisual = new ReceiveItemVisual()
                {
                    strReceinvingFolio = item.strReceinvingFolio
                     ,
                    strdtmDate = item.dtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                     ,
                    strSKU = item.strSKU
                     ,
                    strSupplierName = item.strSupplierName
                     ,
                    strWayofShipping = item.strWayofShipping
                     ,
                    intQtyPallets = Decimal.ToInt32(item.intQtyreceivedPieces)
                     ,
                    intdecBoxes = Decimal.ToInt32(item.decBoxes)
                     ,
                    intQtyreceivedPieces = Decimal.ToInt32(item.intQtyreceivedPieces)
                     ,
                    strOSD = item.strOSD
                     ,
                    strEndCustomerName = item.strEndCustomerName
                  ,
                    strQtyPalletsBox = Convert.ToInt32((Decimal)item.decQtyPallets).ToString() + "/" + Convert.ToInt32(item.decBoxes).ToString().ToString()

                    ,
                    strStatus = item.strStatus
                    , strTrailerFolio = item.strTrailerFolio
                };
                itemVisual.strdtmDate = itemVisual.strdtmDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        } //GetReceiveFilterList

        public ReceiveInfoSKUFolioVS GetReceiveSKUAndFolioInfo(SearchFilterSKUAndFolio aFilter)
        { 
           ReceiveInfoSKUFolioVS lobj_return = new ReceiveInfoSKUFolioVS();
           SearchFilterRecepDetailFSKUBC lobj_Filter = new SearchFilterRecepDetailFSKUBC();

            #region head

            
            List<ReceiveInfoHeadSKUFolioRS> llist_obj_headDB = new List<ReceiveInfoHeadSKUFolioRS>();
            ReceiveInfoHeadSKUFolioVS lobj_headVS = new ReceiveInfoHeadSKUFolioVS();

            List<ReceiveInfoDamageImageItemBlindCRS> llist_obj_damageImageDB = new List<ReceiveInfoDamageImageItemBlindCRS> ();
            ReceiveInfoDamageImageItemBlindCRS lobj_item_imageDB = new ReceiveInfoDamageImageItemBlindCRS();

            List<ReceivePhotoDamageItemVS> llist_obj_damageImageVS = new List<ReceivePhotoDamageItemVS>();
            ReceivePhotoDamageItemVS lobj_item_imageVS = new ReceivePhotoDamageItemVS();

            List<ReceivePackingListItemRS> llist_obj_filepackingRS = new List<ReceivePackingListItemRS>();
            ReceivePackingListItemRS lobj_item_filepackingRS = new ReceivePackingListItemRS();

            List<ReceivePackingListItemVS> llist_obj_filepackingVS = new List<ReceivePackingListItemVS>();
            ReceivePackingListItemVS lobj_item_filepackingVS = new ReceivePackingListItemVS();


            lobj_Filter.strRECFolio = aFilter.strRECFolio;
            int lint_BlindCountId =0; 
            llist_obj_headDB = DynamicRepository.All<ReceiveInfoHeadSKUFolioRS>("USP_CustomerPortal_RECGetReceiMainInfo", SearchFilterMapper.MapReceptionDetailFSKU("HeadREC", lobj_Filter));

            foreach (ReceiveInfoHeadSKUFolioRS item in llist_obj_headDB)
            {
                lobj_headVS.strTrailerFolio = item.strTrailerFolio;
                lobj_headVS.strReceinvingFolio= item.strReceinvingFolio;
                lobj_headVS.strReceivedDate = item.DtmReceivedDate.ToString("dd-MMMyyyy  H:mm");
                lobj_headVS.strCity = item.strCity;
                lobj_headVS.strWareHouseName = item.strWareHouseName;

            }//foreach (ReceiveInfoHeadSKUFolioRS item in llist_obj_headDB)


            lobj_return.HeadInfo = lobj_headVS;
            #endregion

            #region detail

            List<ReceiveInfoDetSKUFolioRS> llist_obj_DetailDB = new List<ReceiveInfoDetSKUFolioRS>();
            List<ReceiveInfoDetSKUFolioItemVS> llist_obj_DetailVS = new List<ReceiveInfoDetSKUFolioItemVS>();
            ReceiveInfoDetSKUFolioItemVS lobj_itemDetailVS = new ReceiveInfoDetSKUFolioItemVS();

            lobj_Filter.strRECFolio = aFilter.strRECFolio;
            lobj_Filter.strSKU = aFilter.strSKU;

            llist_obj_DetailDB = DynamicRepository.All<ReceiveInfoDetSKUFolioRS>("USP_CustomerPortal_RECBySKUaFolio", SearchFilterMapper.MapReceptionDetailFSKU("DetSKUREC", lobj_Filter));

            foreach (ReceiveInfoDetSKUFolioRS itemdet in llist_obj_DetailDB)
            {
                lobj_itemDetailVS = new ReceiveInfoDetSKUFolioItemVS()
                { 
                    strSKU = itemdet.strSKU
                    , strSupplierName = itemdet.strSupplierName
                    ,strWayofShipping = itemdet.strWayofShipping
                    , strQtyPalletsBox = Convert.ToInt32((Decimal)itemdet.decQtyPallets).ToString() + "/" + Convert.ToInt32(itemdet.decBoxes).ToString().ToString()
                    , introwID = itemdet.introwID
                    ,strQtyreceivedPieces = itemdet.intQtyreceivedPieces.ToString()
                   
                };

                lint_BlindCountId = itemdet.intBlindCountId;

                #region photos
                string lstr_Pathimg = @"/src/assets/";
                string lstr_filename = "";

                lobj_Filter.intBlindCountId = lint_BlindCountId;
                llist_obj_damageImageDB = DynamicRepository.All<ReceiveInfoDamageImageItemBlindCRS>("USP_CustomerPortal_RECGetPhotDamByBlindCRec", SearchFilterMapper.MapReceptionDetailFSKU("BlindCountFPhoto", lobj_Filter));

                llist_obj_damageImageVS = new List<ReceivePhotoDamageItemVS>();

                foreach(ReceiveInfoDamageImageItemBlindCRS itemImageRECDamage in  llist_obj_damageImageDB)
                {
                    lobj_item_imageVS = new ReceivePhotoDamageItemVS()
                    {
                        intRowId = itemImageRECDamage.introwID
                         ,
                        intPhotoId = itemImageRECDamage.intPhotoid
                         ,
                        strPhotoPath = itemImageRECDamage.strPhotoPath
                         ,
                        strname = itemImageRECDamage.strPhotoPath
                    };

                    lstr_filename = ""; 
                    if (lobj_item_imageVS.strPhotoPath.IndexOf("01") > -1) lstr_filename = "image1.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("02") > -1) lstr_filename = "image2.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("03") > -1) lstr_filename = "image3.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("04") > -1) lstr_filename = "image4.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("05") > -1) lstr_filename = "image5.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("06") > -1) lstr_filename = "image6.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("07") > -1) lstr_filename = "image7.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("08") > -1) lstr_filename = "image8.jpg";
                    else if (lobj_item_imageVS.strPhotoPath.IndexOf("09") > -1) lstr_filename = "image9.jpg";
                    else lstr_filename = "image10.jpg";

                    lobj_item_imageVS.strPhotoPath = lstr_Pathimg + lstr_filename;



                    llist_obj_damageImageVS.Add( lobj_item_imageVS );
                }//foreach(ReceiveInfoDamageImageItemBlindCRS itemImageRECDamage in  llist_obj_damageImageDB)

                lobj_itemDetailVS.PhotoList = llist_obj_damageImageVS;

                #endregion




                #region docs
                lobj_Filter.intBlindCountId = lint_BlindCountId;

                lstr_filename = "";
                int lintrowid = 0;
                int lint_mod = 0;

                string lstr_Path = @"http://localhost/folder/";

                llist_obj_filepackingRS = DynamicRepository.All<ReceivePackingListItemRS>("USP_CustomerPortal_RECGetPackingPathLByBlindC", SearchFilterMapper.MapReceptionDetailFSKU("BlindCountPackingRECEP", lobj_Filter));
                
                
                llist_obj_filepackingVS = new List<ReceivePackingListItemVS>();

                foreach (ReceivePackingListItemRS itemrecpack in llist_obj_filepackingRS)
                {
                    lobj_item_filepackingVS = new ReceivePackingListItemVS()                    
                    {
                        strFilename = itemrecpack.strFilename
                        , strFilePath = itemrecpack.strFilePath
                    };

                    lintrowid = itemrecpack.introwid;

                    lstr_filename = "";
                    lint_mod = lintrowid% 10;


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

                    lobj_item_filepackingVS.strFilePath = lstr_Path + lstr_filename;


                    llist_obj_filepackingVS.Add( lobj_item_filepackingVS );
                    
                }//foreach(ReceiveInfoDamageImageItemBlindCRS itemImageRECDamage in  llist_obj_damageImageDB)

                lobj_itemDetailVS.PackingList= llist_obj_filepackingVS;

                #endregion


                llist_obj_DetailVS.Add(lobj_itemDetailVS);

                

            }//foreach (ReceiveInfoDetSKUFolioRS itemdet in llist_obj_DetailDB)


            #endregion

            lobj_return.DetailInfo = llist_obj_DetailVS;
            return lobj_return;
        }        //GetReceiveSKUAndFolioInfo

        //

        public List<ReceiveItemCustomerVS> GetReceiveListByCustomerDate(SearchFilterRECCustomerDtm aFilter)
        {
            List<ReceiveItemCustomerRS> list_get = new List<ReceiveItemCustomerRS>();
            List<ReceiveItemCustomerVS> list_return = new List<ReceiveItemCustomerVS>();
            SearchFilterReception lobj_Filter = new SearchFilterReception();

            ReceiveItemCustomerVS itemVisual = new ReceiveItemCustomerVS();
            //filtro
            lobj_Filter.UserId = aFilter.intUserId;
            lobj_Filter.strCustomerName = aFilter.strCustomerName;
            lobj_Filter.intEndCustomerId = aFilter.intEndCustomerId;
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReceiveItemCustomerRS>("USP_CustomerPortal_RECGetListbyEndCustomDate", SearchFilterMapper.MapReception("RECByCustomDate", lobj_Filter));
            // conertir lista 
            foreach (ReceiveItemCustomerRS item in list_get)
            {
                itemVisual = new ReceiveItemCustomerVS()
                {
                    strEndCustomerName  = item.strEndCustomer
                    , strRecFolio  = item.strReceinvingFolio
                    , strDateTime = item.dtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                    ,strTrailerFolio = item.strTrailerFolio
                     
                };
                itemVisual.strDateTime = itemVisual.strDateTime.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        } //GetReceiveListByCustomerDate

        //
        //// GetEndCustomerCatalog
        public List<EndCustomerCAT> GetEndCustomerCatalog(SearchEndCustomer aFilter)
        {
            List<EndCustomerCAT> list_get = new List<EndCustomerCAT>();
            List<ReceiveItemCustomerVS> list_return = new List<ReceiveItemCustomerVS>();
            SearchFilterCatalog lobj_Filter = new SearchFilterCatalog();


            //filtro
            lobj_Filter.strFilter = aFilter.strCustomerName;

            list_get = DynamicRepository.All<EndCustomerCAT>("USP_CustomerPortal_RECGetCATCustomerByname", SearchFilterMapper.MapCatalogFilter("EndCustomer", lobj_Filter));
            return list_get;
        } //GetEndCustomerCatalog

        //GetReceiveListBySKUDate
        public List<ReceiveInfoGroupGenericVS> GetReceiveListBySKUDate(SearchFilterRECSKUDtm aFilter)
        {
            List<ReceiveInfoGroupGenericRS> list_get = new List<ReceiveInfoGroupGenericRS>();
            List<ReceiveInfoGroupGenericVS> list_return = new List<ReceiveInfoGroupGenericVS>();
            SearchFilterReception lobj_Filter = new SearchFilterReception();

            ReceiveInfoGroupGenericVS itemVisual = new ReceiveInfoGroupGenericVS();
            //filtro
            lobj_Filter.UserId = aFilter.intUserId;
            lobj_Filter.strSKU = aFilter.strSKU;            
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReceiveInfoGroupGenericRS>("USP_CustomerPortal_RECGetListbySKUDate", SearchFilterMapper.MapReception("RECBySKUDate", lobj_Filter));
            // conertir lista 
            foreach (ReceiveInfoGroupGenericRS item in list_get)
            {
                itemVisual = new ReceiveInfoGroupGenericVS()
                {// rowId = item.rowId
                  strReceinvingFolio = item.strReceinvingFolio
                  ,stringReceivedDate = item.DtmReceivedDate.ToString("dd-MMMyyyy  H:mm")
                  ,strTrailerFolio = item.strTrailerFolio

                };
                itemVisual.stringReceivedDate = itemVisual.stringReceivedDate.ToUpper();
                list_return.Add(itemVisual);

            } //foreach 

            return list_return;
        } //GetReceiveListBySKUDate
        
        public  List<ReceiveInfoItemSupplierVS> GetReceiveListBySupplierDate(SearchFilterRECSupplierDtm aFilter)
        {
            List<ReceiveInfoItemSupplierVS> lreturnListVS = new List<ReceiveInfoItemSupplierVS>();
            ReceiveInfoItemSupplierVS itemvs = new ReceiveInfoItemSupplierVS();
            List<ReceiveInfoItemSupplierRS> lreceivelistRS = new List<ReceiveInfoItemSupplierRS>();
            SearchFilterReception lobj_filtertoSql = new SearchFilterReception();
            
            lobj_filtertoSql.intSupplierId = 0;
            lobj_filtertoSql.strSupplierName = aFilter.strSupplierName;
            lobj_filtertoSql.dtmStartDate = aFilter.dtmStartDate;
            lobj_filtertoSql.dtmEndDate = aFilter.dtmEndDate;
            lobj_filtertoSql.UserId = aFilter.intUserId;
            lreceivelistRS = DynamicRepository.All<ReceiveInfoItemSupplierRS>("USP_CustomerPortal_RECGetListbySupplierDate", SearchFilterMapper.MapReception("RECBySupplierDate", lobj_filtertoSql));

            foreach (ReceiveInfoItemSupplierRS itemrs in lreceivelistRS)
            {
                itemvs = new ReceiveInfoItemSupplierVS()
                {
                    strSuppliername = itemrs.strSuppliername,
                    strReceinvingFolio = itemrs.strReceinvingFolio,
                    strReceivedDate = itemrs.DtmReceivedDate.ToString("dd-MMMyyyy  H:mm"),
                    strTrailerFolio = itemrs.strTrailerFolio
                };
                lreturnListVS.Add(itemvs);
            }
            return lreturnListVS;
        }

        ///List<ReceiveInfoGroupGenericVS> GetReceiveListByDate(SearchFilterRECDate aFilter);
        public List<ReceiveInfoGroupGenericVS> GetReceiveListByDate(SearchFilterRECDate aFilter)
        {
            List<ReceiveInfoGroupGenericRS> list_get = new List<ReceiveInfoGroupGenericRS>();
            List<ReceiveInfoGroupGenericVS> list_return = new List<ReceiveInfoGroupGenericVS>();
            SearchFilterReception lobj_Filter = new SearchFilterReception();
            ReceiveInfoGroupGenericVS itemVisual = new ReceiveInfoGroupGenericVS();
            //filtro
            lobj_Filter.UserId = aFilter.intUserId;            
            lobj_Filter.dtmStartDate = aFilter.dtmStartDate;
            lobj_Filter.dtmEndDate = aFilter.dtmEndDate;

            list_get = DynamicRepository.All<ReceiveInfoGroupGenericRS>("USP_CustomerPortal_RECGetListbyDate", SearchFilterMapRt.MapReception("Date", lobj_Filter));
            // conertir lista 
            foreach (ReceiveInfoGroupGenericRS item in list_get)
            {
                itemVisual = new ReceiveInfoGroupGenericVS()
                {// rowId = item.rowId
                    strReceinvingFolio = item.strReceinvingFolio,
                    stringReceivedDate = item.DtmReceivedDate.ToString("dd-MMMyyyy  H:mm"),
                    strTrailerFolio = item.strTrailerFolio
                };
                itemVisual.stringReceivedDate = itemVisual.stringReceivedDate.ToUpper();
                list_return.Add(itemVisual);
            }
            return list_return;
        } //GetReceiveListByDate

        public List<RECGetEndCustomerList> GetEndCustomerList()
        {
            return DynamicRepository.All<RECGetEndCustomerList>("USP_CustomerPortal_RECGetEndCustomerList", null);
        }

        public List<RECGetSupplierList> GetSupplierList()
        {
            return DynamicRepository.All<RECGetSupplierList>("USP_CustomerPortal_RECGetSupplierList", null);
        }


        //
    } // class

}//namespace
