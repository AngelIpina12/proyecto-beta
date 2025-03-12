USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_CustomerPortal_RECGetCATCustomerByname]
		@strCustomerName =  'COCA'

SELECT	'Return Value' = @return_value

GO
