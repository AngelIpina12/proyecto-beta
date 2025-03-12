namespace WMS.Service.CustomerLayer.Business.Objects.YM
{
    public class SummaryTrailerDay
    {
        public int TotalTrailersYard { get; set; }
        public int TotalTrailersEmptyIn { get; set; }
        public int TotalTrailersEmptyOut { get; set; }
        public int TotalTrailersUnloadingP { get; set; }
        public int TotalTrailersYardLoadIn { get; set; }
        public int TotalTrailersYardLoadOut { get; set; }
        public int TotalTrailersLoadingP { get; set; }
        public string Customer { get; set; }
        public string WareHouse { get; set; }
        public int isAdmin { get; set; }
        public string PartyRoleName { get; set; }

        public int UserId { get; set; }
    } //sumary

} //namespace
