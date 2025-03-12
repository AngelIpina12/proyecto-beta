namespace WebAPILayer.Viewmodel
{
    public class UserScreenViewModel
    {
        public int? Id { get; set; }
        public int UserId { get; set; }
        public int ScreenId { get; set; }

        public int ModuleId { get; set; }
        public string ScreenName { get; set; }
        public string ImagePath { get; set; }
        public bool AllowAdd { get; set; }
        public bool AllowEdit { get; set; }
        public bool AllowView { get; set; }
        public bool AllowDelete { get; set; }
        public bool AllowPrint { get; set; }
        public bool IsActive { get; set; }
        public string Time { get; set; }
        public int CustomerId { get; set; }
        public string CQCustomerName { get; set; }
        public string CustomerName { get; set; }
        public string AppType { get; set; }
        public int? Type { get; set; }
        public List<UserScreenViewModel> Details { get; set; }

    }
}
