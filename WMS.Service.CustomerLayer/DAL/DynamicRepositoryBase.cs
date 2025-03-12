using System.Data;
using System.Reflection;
using Dapper;
using static Dapper.SqlMapper;
using WMS.Service.CustomerLayer.Constants;
using System.Data.SqlClient;

namespace WMS.Service.CustomerLayer.DAL
{
    public class DynamicRepositoryBase : IDynamicRepository
    {
        public IUnitOfWork UnitOfWork { get; set; }

        public List<T> All<T>(string uspName, object param)
        {
            return UnitOfWork.Connection.Query<T>(
               uspName, param, commandType: CommandType.StoredProcedure
            ).ToList();
        }

        public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> QueryMultiple<T1, T2, T3, T4, T5, T6, T7>(string uspName, object param, int resultsCount)
        {
            GridReader reader = UnitOfWork.Connection.QueryMultiple(uspName, param, commandType: CommandType.StoredProcedure);
            List<T1> T1List = resultsCount > 0 ? reader.Read<T1>().ToList() : new List<T1>();
            List<T2> T2List = resultsCount > 1 ? reader.Read<T2>().ToList() : new List<T2>();
            List<T3> T3List = resultsCount > 2 ? reader.Read<T3>().ToList() : new List<T3>();
            List<T4> T4List = resultsCount > 3 ? reader.Read<T4>().ToList() : new List<T4>();
            List<T5> T5List = resultsCount > 4 ? reader.Read<T5>().ToList() : new List<T5>();
            List<T6> T6List = resultsCount > 5 ? reader.Read<T6>().ToList() : new List<T6>();
            List<T7> T7List = resultsCount > 6 ? reader.Read<T7>().ToList() : new List<T7>();


            return new Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>>(T1List, T2List, T3List, T4List, T5List, T6List, T7List);
        }

        public Tuple<List<T1>, List<T2>> QueryMultiples<T1, T2>(string uspName, object param, int resultsCount)
        {
            GridReader reader = UnitOfWork.Connection.QueryMultiple(uspName, param, commandType: CommandType.StoredProcedure);
            List<T1> T1List = resultsCount > 0 ? reader.Read<T1>().ToList() : new List<T1>();
            List<T2> T2List = resultsCount > 1 ? reader.Read<T2>().ToList() : new List<T2>();
            return new Tuple<List<T1>, List<T2>>(T1List, T2List);
        }
        public T Find<T>(string uspName, int id)
        {
            return UnitOfWork.Connection.Query<T>(
              uspName, new { Id = id }, commandType: CommandType.StoredProcedure
           ).FirstOrDefault();
        }

        public T FindBy<T>(string uspName, object entityParam)
        {
            return UnitOfWork.Connection.Query<T>(
               uspName, entityParam, commandType: CommandType.StoredProcedure
            ).FirstOrDefault();
        }

        public int Add<T>(string uspName, T entity)
        {
            return AddorUpdate(uspName, entity, true);
        }

        public int Update<T>(string uspName, T entity)
        {
            return AddorUpdate(uspName, entity);
        }

        public int DeleteMultiple(string uspName, string ids)
        {
            return UnitOfWork.Connection.Execute(uspName, new { Id = ids }, transaction: UnitOfWork.Transaction, commandType: CommandType.StoredProcedure);
        }

        public int DeleteMultiple<T>(string uspName, T entity)
        {
            int result = -1;
            try
            {
                DynamicParameters dynamicParameters = new DynamicParameters();
                dynamicParameters.AddDynamicParams(entity);
                dynamicParameters.Add("@res", dbType: DbType.Int32, direction: ParameterDirection.Output);
                UnitOfWork.Connection.Execute(uspName, dynamicParameters, commandType: CommandType.StoredProcedure);
                result = dynamicParameters.Get<int>("@res");
            }
            catch (Exception ex)
            {
                throw;
            }

            return result;
        }

        public void Delete(int id)
        {
            UnitOfWork.Connection.Execute(
                "DELETE FROM T WHERE TId = @TId",
                param: new { TId = id }
            );
        }

        public void Delete<T>(T entity)
        {
            //Delete(entity.TId);
        }

        public T FindByName<T>(string name)
        {
            return UnitOfWork.Connection.Query<T>(
                "SELECT * FROM T WHERE Name = @Name",
                param: new { Name = name }
            ).FirstOrDefault();
        }

        private int AddorUpdate<T>(string uspName, T entity, bool isInsert = false)
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

        public int AddOrUpdateDynamic(string uspName, dynamic entity)
        {
            int result = -1; /*Default failing return result.*/
            try
            {
                DynamicParameters dynamicParameters = new DynamicParameters();
                dynamicParameters.AddDynamicParams(entity);


                dynamicParameters.Add("@res", dbType: DbType.Int32, direction: ParameterDirection.Output);

                if (UnitOfWork.Connection.State == ConnectionState.Closed)
                    UnitOfWork.Connection.Open();

                if (UnitOfWork.Transaction != null)
                    result = UnitOfWork.Connection.Execute(uspName, dynamicParameters, transaction: UnitOfWork.Transaction, commandType: CommandType.StoredProcedure);
                else
                    result = UnitOfWork.Connection.Execute(uspName, dynamicParameters, commandType: CommandType.StoredProcedure);

                int? resultNullable = dynamicParameters.Get<int?>("@res");

                if (resultNullable.HasValue)
                    result = resultNullable.Value;
                else
                {
                    try
                    {
                        /*DB logging already in SPs. Logging exception details if still missing something in return.*/
                        ExceptionLog.ErrorsEntry("Error occurred in AddOrUpdateDynamic. uspName :" + uspName);
                        Type dynType = entity.GetType();
                        PropertyInfo[] props = dynType.GetProperties();
                        string strAllPropertyValues = String.Empty;
                        foreach (PropertyInfo prop in props)
                        {
                            strAllPropertyValues += prop.Name + " = " +
                                                    entity.GetType().GetProperty(prop.Name).GetValue(entity, null).ToString() + "; ";
                        }

                        ExceptionLog.ErrorsEntry("Error occurred in AddOrUpdateDynamic. strAllPropertyValues :" + strAllPropertyValues);
                    }
                    catch (Exception ex)
                    {
                        ExceptionLog.ErrorsEntry("Error occurred in AddOrUpdateDynamic. Exception details :" + ex.GetBaseException().ToString());
                    }
                }

                if (UnitOfWork.Transaction == null && UnitOfWork.Connection.State == ConnectionState.Open)
                    UnitOfWork.Connection.Close();
            }
            catch (Exception ex)
            {
                ExceptionLog.ErrorsEntry("Error occurred in AddOrUpdateDynamic. Exception details :" + ex.GetBaseException().ToString());
                throw ex;
            }

            return result;
        }
        public void BulkSave(DataTable item, string[] param)
        {
            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();


            var logpath = configuration["wms:logfile"];


            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(logpath.ToString(), SqlBulkCopyOptions.KeepIdentity))
            {
                bulkCopy.BatchSize = 100;
                bulkCopy.DestinationTableName = item.TableName;
                bulkCopy.WriteToServer(item);
            }
        }

        public void BulkSaveWithNewIdentity(DataTable item, string[] param)
        {
            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();


            var logpath = configuration["wms:logfile"];

            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(logpath.ToString()))
            {
                bulkCopy.BatchSize = 100;
                bulkCopy.DestinationTableName = item.TableName;
                bulkCopy.WriteToServer(item);
            }
        }
    } // public class DynamicRepositoryBase : IDynamicRepository

} //namespace
