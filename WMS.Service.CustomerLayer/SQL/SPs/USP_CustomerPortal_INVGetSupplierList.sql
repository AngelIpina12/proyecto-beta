USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_INVGetSupplierList]    Script Date: 02/12/2024 04:53:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 02-12-2024
-- Description:	Consulta de lista de Suppliers en Inventory
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_INVGetSupplierList]
AS
BEGIN
	SELECT DISTINCT 
		sup.Id AS intInt,
		sup.Name AS strName 
	FROM 
		Inventory inv
	INNER JOIN 
		CustomerSuppliers cusup on cusup.CustomerId = inv.CustomerId 
	INNER JOIN  
		Suppliers sup on sup.Id = cusup.SupplierId
	ORDER BY
		sup.Name
END
