USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_GetFilterTrailerStatus]

SELECT	'Return Value' = @return_value

GO
