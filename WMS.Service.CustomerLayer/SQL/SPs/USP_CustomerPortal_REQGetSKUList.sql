USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_REQGetSKUList]    Script Date: 02/12/2024 04:48:39 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 30-11-2024
-- Description:	Consulta de lista de SKU's de Requirements
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_REQGetSKUList](
	@CustomerId INT NULL
)
AS
BEGIN
	SELECT DISTINCT 
		ReqDet.Id AS Id,
		ReqDet.PartNumber AS Name
	FROM 
		RequirementDetails AS ReqDet
	INNER JOIN 
		Requirements AS Req ON ReqDet.RequirementId = Req.Id
	WHERE 
		Req.ReqStatus <> 68 
	AND 
		Req.ReqStatus <> 69 
	AND 
		Req.CustomerId = 328
	ORDER BY ReqDet.PartNumber 
END
