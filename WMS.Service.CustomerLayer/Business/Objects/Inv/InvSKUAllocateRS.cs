namespace WMS.Service.CustomerLayer.Business.Objects.Inv
{
    public class InvSKUAllocateRS
    {
        public string strSKU { get; set; }
        public string strUOMDesc { get; set; }

        public string strWayShipping { get; set; }
        public DateTime dtmAlloc { get; set; }
        public string strCQFolio { get; set; }
        public int intCustFolio { get; set; }
        public int intQtyReq { get; set; }
        public string strReqStatus { get; set; }

        public string strinvquality { get; set; }

        


    }
}
