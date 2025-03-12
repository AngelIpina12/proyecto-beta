USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_GetSummaryYardMng]
		@UserId = 3025

SELECT	'Return Value' = @return_value

GO
