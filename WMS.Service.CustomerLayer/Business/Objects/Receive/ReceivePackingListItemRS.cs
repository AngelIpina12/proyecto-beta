namespace WMS.Service.CustomerLayer.Business.Objects.Receive
{
    public class ReceivePackingListItemRS
    {
        public int introwid { get; set; }
        public int intDocId { get; set; }
        public int intFileRefId { get; set; }
        public string strFilename { get; set; }
        public int intFileType { get; set; }

        public int intFilePage { get; set; }

        public string strFilePath { get; set; }

    } //class

}//namespace 
