namespace WebAPILayer.Viewmodel
{
    public class BUserViewModel
    {
        public int? Id { get; set; }
        public string UserId { get; set; }
        public string PWD { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Cell { get; set; }
        public int? AddressId { get; set; }
        public string? Address { get; set; }
        public string? CountryName { get; set; }
        public string? StateName { get; set; }
        public string? CityName { get; set; }
        public string? PostalCode { get; set; }
        //public bool IsActive { get; set; }
        //public int? IsActive { get; set; }
        public bool? IsActive { get; set; }
        public List<int> RoleIds { get; set; }
        public int? PartyRoleId { get; set; }
        public string? TempRoleType { get; set; }
        public int? CqCustomerId { get; set; }
        public int? WarehouseId { get; set; }
        public string? PartyRoleName { get; set; }
        public string? WarehouseName { get; set; }
        public string? CustCode { get; set; }
        public string? AllRoleNames { get; set; }
        public string? WorkAllocationType { get; set; }
        public int? WorkAllocationRefId { get; set; }
        public ICollection<UserScreenViewModel> ScreenPermissions { get; set; }
        public int? PrinterId { get; set; }
        public string? PrinterName { get; set; }
        public List<int> UserPrinterIds { get; set; }
        public int? UserDefaultLabelPrinter { get; set; }
        public bool? IsLabelPrinter { get; set; }
        ///public int IsLabelPrinter { get; set; }
        public int? DefaultLabelPrinterId { get; set; }
        public bool? IsAdminUser { get; set; }
        //public int  IsAdminUser { get; set; }

        public bool? IsQAFUser { get; set; }
        public bool? AllWarehouses { get; set; }

        public List<int> WarehouseIds { get; set; }
        public string? Warehouse { get; set; }
        public string? WHIds { get; set; }
        public int? ExternalTypeId { get; set; }
        public string? AddedByUser { get; set; }
        public int? AllocationCount { get; set; }
        public bool? CanCloseNT { get; set; }

        public bool? OperationalSignInRequired { get; set; }

        public int? AddedBy { get; set; }
        public DateTime? AddedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? VisualAidSetUpId { get; set; }
        public string? VisualAidSetUpName { get; set; }
        public string? VoiceServiceUrl { get; set; }
        public int? AllowWarehouseChange { get; set; }
        public bool? AllowMobileDesktop { get; set; }

        public bool? IsBulkUnload { get; set; }

    }
}
