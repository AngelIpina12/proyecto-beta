namespace WMS.Service.CustomerLayer.Business.Objects.Ship
{
    public class ShipTodaySummaryRS
    {
        public int lint_TotalShip {  get; set; }
        public int lint_LoadedOut { get; set; }
        public int lint_EmptyOut { get; set; }
        public int lint_TotalReqs { get; set; }
        public int lint_TotalPallets { get; set; }
	
    }
}
