USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_REQGetSupplierList]    Script Date: 02/12/2024 04:49:31 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 30-11-2024
-- Description:	Consulta de lista de Suppliers de Requirements
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_REQGetSupplierList](
	@CustomerId INT NULL
)
AS
BEGIN
	SELECT DISTINCT 
		Sup.Id,
		Sup.Name
	FROM 
		RequirementDetails AS ReqDet
	INNER JOIN 
		Requirements AS Req ON ReqDet.RequirementId = Req.Id
	LEFT JOIN 
		SupplierProducts AS suppro ON reqdet.CustomerProductId = suppro.CustomerProductId
	LEFT JOIN 
		Suppliers AS sup ON suppro.SupplierId = sup.Id
	WHERE 
		Req.ReqStatus <> 68 
	AND 
		Req.ReqStatus <> 69 
	AND 
		Req.CustomerId = @CustomerId
END
