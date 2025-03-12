
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetCustomerModules] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetCustomerModules]



AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	 ---
	 SELECT intModuleId as 'intModuleId'
           ,strModuleName as 'strModuleName'           
	 from CustomerModules
			 
END