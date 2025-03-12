USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_CustomerPortal_TrailerFolioHistory]
		@strFolio = 'TRCQ136095'

SELECT	'Return Value' = @return_value

GO
