USE [cargoquin]
GO

DECLARE	@return_value int

EXEC	@return_value = USP_CustomerPortal_GetYardMngList
		@UserId = 3025,
		@intIsToday = 1,
		@intIsTrailerFolio = 0,
		@strTrailerFolio = NULL,
		@intIsRangeDate = 1,
		@dtmStartDate=  NULL,
		@dtmEndDate =  NULL,
		@intIsTrailerNumber = 0,
		@strTrailerNumber = NULL,
		@intStatusId = 0,
		@strStatusVal = NULL

SELECT	'Return Value' = @return_value

GO
--153563
--DtmReceivedDate
--2023-12-01 14:19:00.000