USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetSupplierList]    Script Date: 02/12/2024 04:50:56 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 02-12-2024
-- Description:	Consulta de lista de Suppliers en Receive
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetSupplierList]
AS
BEGIN
	SELECT DISTINCT 
		BC.SupplierId AS intId,
		BC.Supplier AS strName
	FROM 
		BlindCounts AS BC
	WHERE
		BC.SupplierId IS NOT NULL AND BC.Supplier IS NOT NULL
	ORDER BY 
		BC.Supplier 	
END
