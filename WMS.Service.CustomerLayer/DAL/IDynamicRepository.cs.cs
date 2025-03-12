using System.Data;

namespace WMS.Service.CustomerLayer.DAL
{
    public interface IDynamicRepository
    {
        IUnitOfWork UnitOfWork { get; set; }
        int Add<T>(string uspName, T item);
        int AddOrUpdateDynamic(string uspName, dynamic entity);
        List<T> All<T>(string uspName, object param);
        System.Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> QueryMultiple<T1, T2, T3, T4, T5, T6, T7>(string uspName, object param, int resultsCount);
        System.Tuple<List<T1>, List<T2>> QueryMultiples<T1, T2>(string uspName, object param, int resultsCount);
        void Delete(int id);
        int DeleteMultiple(string uspName, string ids);
        int DeleteMultiple<T>(string uspName, T entity);
        void Delete<T>(T entity);
        T Find<T>(string uspName, int id);
        T FindBy<T>(string uspName, object entityParam);
        T FindByName<T>(string name);
        int Update<T>(string uspName, T entity);
        void BulkSave(DataTable item, string[] param);
        void BulkSaveWithNewIdentity(DataTable item, string[] param);
    } //interface

} //namespace
