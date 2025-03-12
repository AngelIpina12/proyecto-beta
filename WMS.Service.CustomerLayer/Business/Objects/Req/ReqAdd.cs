using System.Reflection.Metadata;
using WMS.Service.CustomerLayer.Business.Extension;

namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqAdd
    {
        public int? Id { get; set; }
        public int? CQCustomerId { get; set; }
        public int? MaterialFrom { get; set; } /* CustomerId */
        public int? RequirementTypeId { get; set; }
        public string? RequirementFolioNumber { get; set; }
        public int? AddedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? RequirementDate { get; set; }
        public string? RequirementTime { get; set; }
        public DateTime? AddedDate { get; set; }
        public string? ModifiedDate { get; set; }
        public string? RequirementFolio { get; set; }
        public string? UploadedDocuments { get; set; }
        public string? CQCustomerName { get; set; }
        public string? CustomerName { get; set; }
        public string? RequirementType { get; set; }
        public string? UploadedFile { get; set; }
        public int? ReceiptType { get; set; }
        public bool? IsManual { get; set; }
        public string? ExeRequirementNotificatioPath { get; set; }
        public string? MailPath { get; set; }
        public string? Folio { get; set; }
        public string? Warehouse { get; set; }
        public int? WarehouseId { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? SiteUrl { get; set; }
        public string? ReportPath { get; set; }
        public Guid? guid { get; set; }
        public bool? IsCustomer { get; set; }
        public bool? IsOverrideTimeToFulfill { get; set; }
        public string? Comment { get; set; }
        public DateTime? OverridedDateToFulfill { get; set; }
        public List<Document>? Documents { get; set; }
        public List<ReqDetailAdd>? ExtRequirementDetails { get; set; }

    }
}
