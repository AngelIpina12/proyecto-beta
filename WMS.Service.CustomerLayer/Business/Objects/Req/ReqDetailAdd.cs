namespace WMS.Service.CustomerLayer.Business.Objects.Req
{
    public class ReqDetailAdd
    {
        public int? Id { get; set; }
        public int? ExternalRequirementId { get; set; }
        public int? CustomerProductId { get; set; }
        public string? Sku { get; set; }
        public string? Description { get; set; }
        public string? Quantity { get; set; }
        public string? ProductionLine { get; set; }
        public string? Lot { get; set; }
        public string? Po { get; set; }
        public string? Release { get; set; }
        public string? Status { get; set; }
        public int? StatusId { get; set; }
        public string? Supplier { get; set; }
        public int? SupplierProductId { get; set; }
        public string? Comment { get; set; }
        public List<int>? CpIds { get; set; }
    }
}
