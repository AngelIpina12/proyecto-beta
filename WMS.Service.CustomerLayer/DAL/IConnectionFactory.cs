using System.Data;

namespace WMS.Service.CustomerLayer.DAL
{
    public interface IConnectionFactory : IDisposable
    {
        IDbConnection GetConnection { get; }
    }

} //namespace
