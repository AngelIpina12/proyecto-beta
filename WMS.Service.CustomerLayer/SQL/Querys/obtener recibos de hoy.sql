USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[USP_CustomerPortal_RECGetToday]
		@UserId = 3025

SELECT	'Return Value' = @return_value

GO
