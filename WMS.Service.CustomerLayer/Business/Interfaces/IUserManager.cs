using WMS.Service.CustomerLayer.DAL;
//using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Objects.us;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface IUserManager
    {
        IUserManager UserManager { get; set; }        

        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }
        List<UserData> GetUserInfo(SearchFilterUserData asearchUSData);


    } // interface

} //namespace
