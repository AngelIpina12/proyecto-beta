USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetEndCustomerList]    Script Date: 02/12/2024 04:52:42 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 30-11-2024
-- Description:	Consulta de lista de End Customer
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetEndCustomerList]
AS
BEGIN
	SELECT DISTINCT 
		Custrts.Id AS intId,
		Custrts.Name AS strName
	FROM 
		RecTrailers AS Rec
	LEFT JOIN 
		RectrailerShipments AS Rts ON Rec.Id = Rts.RecTrailerId
	LEFT JOIN 
		Customers AS Custrts ON Rts.CustomerId = Custrts.Id
	WHERE
		Custrts.Id IS NOT NULL AND Custrts.Name IS NOT NULL
	ORDER BY
		Custrts.Name
END
