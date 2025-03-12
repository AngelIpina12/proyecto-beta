using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Business.Mapper;
//using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Filter.User;
using WMS.Service.CustomerLayer.Business.Objects.us;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class UserManager : BaseManager, IUserManager
    {
        IServiceProvider _provider { get; set; }

        public UserManager(IDynamicRepository _dynamicRepository, IServiceProvider provider) 
        {
            _provider = provider;
            DynamicRepository = _dynamicRepository;

        } //public UserManager(IDynamicRepository _dynamicRepository, IServiceProvider provider) 

        IUserManager IUserManager.UserManager { get; set; }

        public List<UserData> GetUserInfo(SearchFilterUserData asearchUSData)
        {
            return DynamicRepository.All<UserData>("USP_GetUserInfo", SearchFilterMapper.MapUSDataFilter("UserDataFilter", asearchUSData));
        }


    } //class
} //namespace
