namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceiveInfoSKUFolioVS
    {
        public ReceiveInfoHeadSKUFolioVS HeadInfo { get; set; }
        public List<ReceiveInfoDetSKUFolioItemVS> DetailInfo { get; set; }
    } //class
}//namespace
