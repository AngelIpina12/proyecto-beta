namespace WMS.Service.CustomerLayer.Constants
{
    public static class Messages
    {
        #region Messages
        public const string UNABLE_TO_ACCESS_TOKEN = "Unable to access token.";
        public const string Matched = "Matched";
        public const string QUANTITY_NOT_MATCHING = "Quantity not matching.";
        public const string SKU_NOT_FOUND = "P.S.N.F."; // Packing slip not found.
        public const string BLINDCOUNT_NOT_FOUND = "BlindCount not found.";
        public const string LOT_NOT_MATCHED = "Lot Not Matched";
        public const string SUPPLIER_NOT_MATCHED = "Supplier Not Matched";
        public const string REDO_SETUP = "Redo set up.";
        public const string EMAIL_SUBJECT = "Receiving notification for folio#";
        public const string EMAIL_SUBJECTQA = "Attention Attention - QS Not Allocatable -";
        public const string OnHandlevel = "OnHand level notification";
        public const string DriverLeave = "Driver leave without access notification for folio#";
        public const string EMAIL_SUBJECT_REQUIREMENT = "Requirement notification for folio#";
        public const string EMAIL_SUBJECT_EXEREQUIREMENT = "External requirement notification for Schdule#";
        public const string EMAIL_SUBJECT_ASN = "ASN notification for Schedule#";
        public const string SKUEEMAIL_SUBJECT = "SKU QueryReport";
        public const string PACKING_DOCUMENT = "packingList Document:";
        public const string PEDIMENTO_DOCUMENT = "Pedimento Document:";
        public const string INVOICE_DOCUMENT = "Invoice Document:";
        public const string CUSTOMER_MISMATCH = "Customer Mismatch.";
        public const string EMAIL_SUBJECTToShipment = "Shipment Query Notification #";
        public const string EMAIL_SUBJECTToReceipt = "Receipts Query Notification #";
        public const string EMAIL_ProductWiseCheck = "Productwise Inventory";
        public const string EMAIL_SIDRecords = "SID Records";
        public const string EMAIL_PODsList = "PODs List";
        public const string EMAIL_KardexForSku = "KardexForSku notification";
        public const string EMAIL_IMMEXReport = "Immex Report notification";
        #endregion

        #region Success codes
        public const string Success_50001 = "Succ50001"; // Saved successfully.
        public const string Success_50002 = "Succ50002"; //"Theme successfully changed."
        public const string Success_50003 = "Succ50003"; //"Deleted successfully."
        public const string Success_50004 = "Succ50004";
        public const string Success_50005 = "Succ50005";
        public const string Success_50006 = "Succ50006";
        public const string Success_50007 = "Succ50007";

        #endregion

        #region Error codes
        public const string Error_10001 = "Err10001"; //Internal Server Error. Please Contact your Administrator.
        public const string Error_10002 = "Err10002"; // Not found.
        #endregion

        #region General
        public const string Driver = "Driver";
        public const string Auditor = "Auditor";
        public const string ForkLiftDriver = "ForkLift Driver";
        public const string ConTeoCiclico = "ConTeo Ciclico";
        #endregion

        #region Constants
        public const string User_Exist = "User name already exists.";

        public const string UserValidate = "ValidateUser";

        public const string PartRoleValidate = "PartyRoleUser";

        public const string UserNameValidate = "ValidateUserName";

        public const string EnglishLanguage = "en-US";

        public const string MexicanLanuage = "es-MX";

        public const string RHEEM = "RHEEM";
        public const string SP = "SP";//Salvage Product
        public const string CQ = "CQ";//Cargoquin
        public const string PDF = "PDF";
        public const string Excel = "Excel";

        public const string ShipmentDocs = "~/Content/Uploads/Docs/TrailerDocs/ShipmentDocs/";
        public const string QualityStatusDocs = "~/Content/Uploads/Docs/QualityStatusDocs/";
        public const string InventoryDocs = "~/Content/Uploads/Docs/InventoryDocs/";
        public const string TrailerDocs = "~/Content/Uploads/Docs/TrailerDocs/";
        public const string RecevingNotifocation = "\\Exports\\RecevingNotification\\";
        public const string SIDRecordsNotifocation = "\\Exports\\SIDRecords\\";
        public const string ImmexReportNotification = "\\Exports\\IMMEXReport\\";
        public const string LabelPrint = "\\Exports\\LabelPrint\\";
        public const string CustomizedReport = "\\Exports\\CustomizationReport\\";
        public const string CustomizedReportPreview = "\\Exports\\CustomizationReportPreview\\";
        public const string PhotoPath = "\\Uploads\\Photos\\";
        public const string GetPhotosRecevingPath = "~/Content/Uploads/Photos/ReceviedPhotos/";
        public const string ContractDocs = "~/Content/Uploads/Docs/ContractDocs/";
        public const string ShipmentExportPath = "\\Exports\\ShipmentQuery\\";
        public const string CustDoc = "~/Content/Exports/CustDocs/";
        public const string PODDocs = "~/Content/Uploads/Docs/TrailerDocs/ShipmentDocs/PODDocs/";
        public const string Requirement = "~/Content/Uploads/Docs/RequirementDocs/";
        public const string ASNDocs = "\\Uploads\\Docs\\ASNDocs\\";
        public const string ASN = "~/Content/Uploads/Docs/ASNDocs/";
        public const string RequirementDocs = "\\Uploads\\Docs/RequirementDocs\\";
        public const string QAFindingPhotos = "~/Content/Uploads/Photos/QAFindingPhotos/";
        public const string RequirementEmailDocs = "~/Content/Uploads/Docs/RequirementsEmailDocs/";
        public const string ShipmentPhotos = "~/Content/Uploads/Photos/ShippingPhotos/";
        public const string NTPhotos = "~/Content/Uploads/Photos/NotTherePhotos/";
        public const string GatePassPhotos = "~/Content/Uploads/Photos/GatePassPhotos/";
        public const string DamagedPhotos = "~/Content/Uploads/Photos/DamagedPhotos/";
        public const string BlindCountDamagedPath = "~/Content/Uploads/Docs/TrailerDocs/BlindcountDamaged/";
        public const string ExternalRequirementDocPath = "~/Content/Uploads/Docs/RequirementDocs/";
        public const string LoadingTrailerPhotos = "~/Content/Uploads/Photos/LoadingTrailerPhotos/";
        public const string CycleCountScoreResultsDocs = "~/Content/Exports/CycleCountScoreResultDocs/";
        // public const string TrailerDocsPath = "/Content/Uploads/Docs/TrailerDocs/ShipmentDocs/";
        public const string ReturnMaterialDocs = "~/Content/Uploads/Docs/TrailerDocs/MaterialReturnedDocs/";
        public const string LogoPath = "/Content/Uploads/Docs/ContractDocs/Logos/";
        public const string ReceivingInspectionPath = "~/Content/Uploads/Photos/ReceivingInspectionPhotos/";
        #endregion
    } //class
} //namespace
