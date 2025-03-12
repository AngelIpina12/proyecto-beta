using WMS.Service.CustomerLayer.Business.Extension;
using WMS.Service.CustomerLayer.Business.Filter.Formap;
using WMS.Service.CustomerLayer.Business.Filter;
using WMS.Service.CustomerLayer.Business.Filter.Inv;

namespace WMS.Service.CustomerLayer.Business.Mapper
{
    public static class SearchFilterMapperInv
    {
        public static dynamic Map(string type, SearchFilterInvGen searchFilter)
        {

            switch (type)
            {
                case "Today":
                    return new
                    {
                        intUserId = searchFilter.intUserId                        
                    };
                case "SKUWork":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,intInvId = searchFilter.intInvId
                        ,strSKU = searchFilter.strSKU
                    };
                //SKUAlloc
                case "SKUAlloc":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        intInvId = searchFilter.intInvId
                        ,
                        strSKU = searchFilter.strSKU
                    };
                case "SKUNotAlloc":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        intInvId = searchFilter.intInvId
                        ,
                        strSKU = searchFilter.strSKU
                    };
                case "SKUOnHand":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,
                        intInvId = searchFilter.intInvId
                        ,
                        strSKU = searchFilter.strSKU
                    };
                case "EndSKU":
                    return new
                    {
                        intUserId = searchFilter.intUserId                        
                        ,
                        strSKU = searchFilter.strSKU
                    };
                case "EndCustomer":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                        ,strEndCustomer = searchFilter.strEndCustomer
                    };
                case "SupSKU":
                        return new
                        {
                            intUserId = searchFilter.intUserId
                        ,
                            strSupSKU = searchFilter.strSKU
                        };
                
                case "Supplier":
                    return new
                    {
                        intUserId = searchFilter.intUserId
                    ,
                        strSupplierName = searchFilter.strSupplierName
                    };
            }//  switch (type)
            return null;

        } //public static dynamic Map(string type, SearchFilter searchFilter)

    } //class


}
