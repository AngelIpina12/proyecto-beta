using FastMember;
using System.Data;

namespace WMS.Service.CustomerLayer.Business.Extension
{
    public static class CustomDataTableExtensions
    {
        public static DataTable ToDataTable<T>(ICollection<T> data, string[] columnNames)
        {
            DataTable tmpTable = new DataTable();

            if (data != null && data.Count() > 0)
            {
                using (var reader = ObjectReader.Create(data, columnNames))
                {
                    tmpTable.Load(reader);
                }
            }
            else
            {
                foreach (var colName in columnNames)
                    tmpTable.Columns.Add(colName);
            }

            return tmpTable;
        }

        public static DataTable ToDataTable<T>(ICollection<T> data, string columnName)
        {
            DataTable table = new DataTable();
            table.Columns.Add(columnName, typeof(T));

            if (data != null && data.Any())
            {
                foreach (T item in data)
                    table.Rows.Add(item);
            }

            return table;
        }
    } //static class customdataTablñeextension

} //namespace 
