using Dapper;
using System.Data;

namespace WMS.Service.CustomerLayer.DAL
{
    public class RepositoryBase<T> : IRepository<T> where T : class
    {
        //  [SimpleIoCPropertyInject]
        public IUnitOfWork UnitOfWork { get; set; }

        public List<T> All(string uspName, object param)
        {
            return UnitOfWork.Connection.Query<T>(
               uspName, param, commandType: CommandType.StoredProcedure
            ).ToList();
        }

        public T Find(string uspName, int id)
        {
            return UnitOfWork.Connection.Query<T>(
              uspName, new { Id = id }, commandType: CommandType.StoredProcedure
           ).FirstOrDefault();
        }

        public int Add(string uspName, T entity)
        {
            return AddorUpdate(uspName, entity, true);
        }

        public int Update(string uspName, T entity)
        {
            return AddorUpdate(uspName, entity);
        }

        public int DeleteMultiple(string uspName, string ids)
        {
            return UnitOfWork.Connection.Execute(uspName, new { Id = ids }, transaction: UnitOfWork.Transaction, commandType: CommandType.StoredProcedure);
        }
        public void Delete(int id)
        {
            UnitOfWork.Connection.Execute(
                "DELETE FROM T WHERE TId = @TId",
                param: new { TId = id }
            );
        }

        public void Delete(T entity)
        {
            //Delete(entity.TId);
        }

        public T FindByName(string name)
        {
            return UnitOfWork.Connection.Query<T>(
                "SELECT * FROM T WHERE Name = @Name",
                param: new { Name = name }
            ).FirstOrDefault();
        }

        private int AddorUpdate(string uspName, T entity, bool isInsert = false)
        {
            int result = -1;
            try
            {
                DynamicParameters dynamicParameters = new DynamicParameters();
                dynamicParameters.AddDynamicParams(entity);

                if (isInsert)
                    dynamicParameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

                if (UnitOfWork.Connection.State == ConnectionState.Closed)
                    UnitOfWork.Connection.Open();

                if (UnitOfWork.Transaction != null)
                    result = UnitOfWork.Connection.Execute(uspName, dynamicParameters, transaction: UnitOfWork.Transaction, commandType: CommandType.StoredProcedure);
                else
                    result = UnitOfWork.Connection.Execute(uspName, dynamicParameters, commandType: CommandType.StoredProcedure);

                result = dynamicParameters.Get<int>("@Id");

                if (UnitOfWork.Transaction == null && UnitOfWork.Connection.State == ConnectionState.Open)
                    UnitOfWork.Connection.Close();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return result;
        }
    } // clase

} //namespace
