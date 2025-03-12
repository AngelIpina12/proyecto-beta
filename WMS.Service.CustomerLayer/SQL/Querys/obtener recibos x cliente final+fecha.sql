USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_CustomerPortal_RECGetListbyEndCustomDate]
		@strCustomerName = 'BOR',
		@intUserId = 325,
		@intCustomerId = NULL,
		@dtmStartDate = '20230317',
		@dtmEndDate = '20230317'

SELECT	'Return Value' = @return_value

GO
