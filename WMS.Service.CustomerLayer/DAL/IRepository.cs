namespace WMS.Service.CustomerLayer.DAL
{
    public interface IRepository<T> where T : class
    {
        IUnitOfWork UnitOfWork { get; set; }
        int Add(string uspName, T item);
        List<T> All(string uspName, object param);
        void Delete(int id);
        int DeleteMultiple(string uspName, string ids);
        void Delete(T entity);
        T Find(string uspName, int id);
        T FindByName(string name);
        int Update(string uspName, T entity);
    } // REP

} //namespace
