using System.Data;

namespace WMS.Service.CustomerLayer.DAL
{
    public interface IUnitOfWork : IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction Transaction { get; }
        void Begin();
        void Commit();
        void Rollback();
    } //unitofwork

} //namespace
