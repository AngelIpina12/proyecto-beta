using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter;
using WMS.Service.CustomerLayer.Business.Filter.Formap;
using WMS.Service.CustomerLayer.Business.Filter.Receive;
using WMS.Service.CustomerLayer.Business.Filter.Req;
using WMS.Service.CustomerLayer.Business.Filter.User;

using WMS.Service.CustomerLayer.Business.Filter.YM;


namespace WMS.Service.CustomerLayer.Business.Mapper
{
    //    public class SearchFilterMapRt
    public static class SearchFilterMapRt
    {     
        public static dynamic MapReception(string type, SearchFilterReception aReception)
        {
            switch (type)
            {
                
                case "Date":
                    return new
                    {
                      
                        intUserId = aReception.UserId                        
                        ,
                        dtmStartDate = aReception.dtmStartDate
                         ,
                        dtmEndDate = aReception.dtmEndDate
                    };
                
            }
            return null;
        }
        //

    }//class


}
