USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_CustomerPortal_TrailerFolioHistory]
		@strFolio ='TRCQ135977'--'TRC252637'-- 'TRCQ136095'

SELECT	'Return Value' = @return_value

GO

--select * from RecTrailers where Id =154278 --TRC252637
