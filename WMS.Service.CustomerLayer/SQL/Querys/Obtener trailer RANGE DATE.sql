USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = USP_CustomerPortal_GetYardMngList
		@UserId = 3025,
		@intIsToday = 0  ,
		@intIsTrailerFolio = 0,
		@strTrailerFolio = NULL,
		@intIsRangeDate = 1,
		@dtmStartDate=  '2023-12-01 00:00' ,
		@dtmEndDate =  '2023-12-12 23:59' ,
		@intIsTrailerNumber = 0,
		@strTrailerNumber = NULL,
		@intStatusId = 0,
		@strStatusVal = NULL

SELECT	'Return Value' = @return_value

GO