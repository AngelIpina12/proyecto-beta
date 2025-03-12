using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Managers
{
    public class BaseManager
    {
        public IUnitOfWork UnitOfWork { get; set; }

        public IDynamicRepository DynamicRepository { get; set; }

        public void BeginTransaction()
        {
            UnitOfWork.Begin();
        }
        public void CommitTransaction()
        {
            UnitOfWork.Commit();
        }
        public void RollBackTransaction()
        {
            UnitOfWork.Rollback();
        }
    }//class

}//namespace
