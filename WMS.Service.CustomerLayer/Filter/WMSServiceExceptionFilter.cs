using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Net;
using WMS.Service.CustomerLayer.Constants;

namespace WMS.Service.CustomerLayer.Filter
{
    public class WMSServiceExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext actionExecutedContext)
        {
            base.OnException(actionExecutedContext);
            HttpResponseMessage response = null;

            if (actionExecutedContext.Exception is WMSServicesException)
            {
                response = new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent((actionExecutedContext.Exception as WMSServicesException).StatusCode)
                };
            }
            else
            {
                string exceptionMessage = string.Empty;

                if (actionExecutedContext.Exception.InnerException == null)
                    exceptionMessage = actionExecutedContext.Exception.Message;
                else
                    exceptionMessage = actionExecutedContext.Exception.InnerException.Message;

                ExceptionLog.ErrorsEntry("Exception occurred. Exception details: " + exceptionMessage + " base exception details: " + actionExecutedContext.Exception.GetBaseException().ToString());

                response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(Messages.Error_10001)
                };
            }
            JsonResult ljsresult;


            actionExecutedContext.Result = new JsonResult(response);



        }

    } // class
} //namespace
