USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_REQGetListRequerimentDetails] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 06-11-2024
-- Description:	Consulta de detalles de requerimientos filtrado por requerimiento escogido
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_REQGetListRequerimentDetails]
	@strReqFolio NVARCHAR(50)
AS
BEGIN
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

    --CREACIÓN DE TABLA TEMPORAL
	CREATE TABLE 
		#tempRequirementDetailsList(
			ID int IDENTITY(1,1) PRIMARY KEY,
			strPartNumber NVARCHAR(50) NULL,
			strUOM NVARCHAR(50) NULL,
			decQuantity DECIMAL(18, 3) NULL,
			decQtyAssigned DECIMAL(18, 3) NULL,
			decPendingQty DECIMAL(18, 3) NULL,
			intPicking INT NULL,
			decQtyShipped DECIMAL(18, 3) NULL,
			intInventoryId INT NULL,
			intShipmentId INT NULL
			
		)
	
	--INSERCIÓN DE DATOS A TABLA TEMPORAL
	INSERT INTO 
		#tempRequirementDetailsList(
			strPartNumber,
			strUOM,
			decQuantity,
			decQtyAssigned,
			decPendingQty,
			intPicking,
			decQtyShipped,
			intInventoryId,
			intShipmentId
		)
	SELECT 
		reqdet.PartNumber,
		CASE WHEN proUOM.Id IS NULL THEN 'No hay UOM' ELSE proUOM.Name END AS strUOM,
		reqdet.Quantity,
		reqdet.QtyAssigned,
		reqdet.PendingQty,
		reqdet.Picking,
		CASE 
			WHEN EXISTS (
				SELECT 1 
				FROM ShipmentDetails 
				WHERE Status = 188 AND ReqDetailId = reqdet.Id
			)
			THEN (
				SELECT TOP 1 PickedQuantity 
				FROM ShipmentDetails 
				WHERE Status = 188 AND ReqDetailId = reqdet.Id
			)
			ELSE 0.000
		END AS decQtyShipped,
		inv.Id,
		SD.ShipmentId
	FROM 
		RequirementDetails reqdet
	LEFT JOIN 
		Requirements AS req ON reqdet.RequirementId = req.Id
	LEFT JOIN
		CustomerProducts AS cuspro ON reqdet.CustomerProductId = cuspro.Id
	LEFT JOIN
		Products AS pro ON cuspro.ProductId = pro.Id
	LEFT JOIN
		ProductUoms AS proUOM ON pro.ProductUomId = proUOM.Id
	LEFT JOIN
		ShipmentDetails AS SD ON reqdet.Id = SD.ReqDetailId
	LEFT JOIN
		InventoryDetails AS invdet ON SD.InventoryDetailId = invdet.Id
	LEFT JOIN
		Inventory AS inv ON invdet.InventoryId = inv.Id
	WHERE  
		req.REQFolio = @strReqFolio
	AND req.ReqStatus <> 69
	AND req.ReqStatus <> 68

	ORDER BY
		req.Id ASC
				
	--RETORNO DE DATOS
	SELECT
		strPartNumber as 'strPartNumber',
		strUOM as 'strUOM',
		decQuantity as 'decQuantity',
		decQtyAssigned as 'decQtyAssigned',
		decPendingQty as 'decPendingQty',
		intPicking as 'intPicking',
		decQtyShipped as 'decQtyShipped',
		intInventoryId as 'intInventoryId',
		intShipmentId as 'intShipmentId'
	FROM 
		#tempRequirementDetailsList
	GROUP BY 
		strPartNumber,
		strUOM,
		decQuantity,
		decQtyAssigned,
		decPendingQty,
		intPicking,
		decQtyShipped,
		intInventoryId,
		intShipmentId

	RETURN 0
END
