namespace WMS.Service.CustomerLayer.Constants
{
    public static class ExceptionLog
    {
        public static void ErrorsEntry(string ErrorSource)
        {

            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();


            var logpath = configuration["wms:logfile"];

            var directory = Path.GetDirectoryName(logpath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            StreamWriter streamWriter = File.AppendText(logpath.ToString());
            streamWriter.WriteLine("====================" + DateTime.Now.ToLongDateString() + "  " + DateTime.Now.ToLongTimeString() + "====================");
            streamWriter.WriteLine(ErrorSource.ToString());
            streamWriter.Flush();
            streamWriter.Close();
        }
    } //public static class ExceptionLog

} // constants
