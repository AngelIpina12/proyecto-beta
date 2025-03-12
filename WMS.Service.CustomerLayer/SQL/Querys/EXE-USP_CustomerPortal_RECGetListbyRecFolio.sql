USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_CustomerPortal_RECGetListbyRecFolio]
		@strRECFolio = 'RECTAS4'

SELECT	'Return Value' = @return_value

GO
