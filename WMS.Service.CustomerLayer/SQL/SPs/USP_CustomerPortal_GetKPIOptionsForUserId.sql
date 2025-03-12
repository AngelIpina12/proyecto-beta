
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetKPIOptionsForUserId] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetKPIOptionsForUserId]
(@UserId INT)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	 ---
	 SELECT intOptionId AS 'intOptionId'
		  ,intModuleId AS 'intModuleID'
		  ,intCustOptionActive AS 'intActive'
	      ,strTitle AS 'strTitle'
		  ,strLegend AS 'strLegend'
		  ,strUrl AS 'strUrl'
		  ,strTitle +'('+  strLegend +')' AS 'strDisplayText'
	 FROM CustomerOptions
	 WHERE intUserId = @UserId 
			 
END