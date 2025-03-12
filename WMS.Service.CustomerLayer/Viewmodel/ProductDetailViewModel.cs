namespace WMS.Service.CustomerLayer.Viewmodel
{
    public class ProductDetailViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductUOMId { get; set; }
        public bool Active { get; set; }
        public string Description { get; set; }
        public int? AlternativeProductId { get; set; }
        public int ProductType { get; set; }
        public double Weight { get; set; }
        public string CategoryName { get; set; }
        public string UOMName { get; set; }
        public int CustomerId { get; set; }
        public int CustomerProductId { get; set; }
        public string CustomerName { get; set; }
        public string RevisionNumbers { get; set; } 
        public bool ReceiveByLot { get; set; }
        public object Revisions { get; set; } 
        public object ProductKits { get; set; } 
        public object ProductPackages { get; set; } 
        public object SupplierProducts { get; set; }
        public object Bins { get; set; }
        public string ShippingWay { get; set; }
        public int Status { get; set; }
        public int IsActive { get; set; }
        public double SKUPrice { get; set; }
        public object CpIds { get; set; } 
        public object BinIds { get; set; }
        public int ResultCount { get; set; }
        public double StandardPack { get; set; }
        public int ShippingUom { get; set; }
        public int SupplierCount { get; set; }
        public int Stackable { get; set; }
        public int WayOfStorage { get; set; }
        public int TotalRecords { get; set; }
        public bool IsServerExport { get; set; }
        public Guid ExcelExportGuid { get; set; }
        public string StorageWay { get; set; }
        public string WayOfShipping { get; set; }
    }
}
