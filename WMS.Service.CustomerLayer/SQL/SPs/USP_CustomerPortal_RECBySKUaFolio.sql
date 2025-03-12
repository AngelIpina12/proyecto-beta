USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECBySKUaFolio]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECBySKUaFolio]
--  ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECBySKUaFolio]

(@strRECFolio VARCHAR(50) NULL -- Folio #
,@strSKU VARCHAR(50) NULL
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
			 
			 	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempReceivingList(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,strReceinvingFolio VARCHAR(50) NULL
				   ,strSKU VARCHAR(50) NULL				   
				   ,strSupplierName VARCHAR(120) NULL
				   ,strWayofShipping VARCHAR(20) NULL
				   ,decQtyPallets decimal(9,3) NULL
				   ,decBoxes decimal(9,3) NULL
				   ,intQtyreceivedPieces INT NULL
				   ,intrecid INT NULL
				   ,intinvid INT NULL
				   , intcustomerprod int NULL
				   ,intBlindCountId int null
				   )
	----------------
	
	
	--insertar tabla de resultados 
		INSERT INTO #tempReceivingList(
										 --Id ,
										 strReceinvingFolio ,strSKU ,strSupplierName 
										 ,strWayofShipping ,decQtyPallets ,decBoxes 
										 ,intQtyreceivedPieces ,intrecid ,intinvid 
										 ,intcustomerprod ,intBlindCountId 
										)

	-------------------

			 SELECT
			   --strReceinvingFolio ,strSKU ,strSupplierName 
			   rts.RECFolio , prod.Name , bc.Supplier
			   ---,strWayofShipping 
			   , (
					case when  prod.shippinguom  = 2 then 'Pallets' 
						when  prod.shippinguom = 3 then 'pieces' 
					else 'Boxes' 
					end
				)
				
			   ---,decQtyPallets ,decBoxes 
			   , bc.Pallets , bc.Boxes
			   --,intQtyreceivedPieces ,intrecid ,intinvid 
			   , bc.Quantity , rec.Id, bc.InventoryId
			   --,intcustomerprod 
			  , bc.CustomerProductId
			   --intBlindCountId 
			   , bc.Id

				 FROM  RectrailerShipments rts  				 
				  INNER JOIN RecTrailers rec on rts.RecTrailerId= rec.Id
				  INNER JOIN BlindCounts  bc on bc.RecTrailerShipmentId =rts.Id 
				  INNER JOIN CustomerProducts custprod on custprod.Id = bc.CustomerProductId
				  INNER JOIN Products prod on prod.Id = custprod.ProductId
				WHERE  rts.RECFolio = @strRECFolio
				AND prod.Name =@strSKU 
			Order by rec.Id ASC

			select 
			ID  as 'introwID'
			,strReceinvingFolio as 'strReceinvingFolio'
			,strSKU as 'strSKU'
			,strSupplierName as 'strSupplierName'
			,strWayofShipping as 'strWayofShipping'
			,decQtyPallets as 'decQtyPallets'
			,decBoxes as 'decBoxes'
			,intQtyreceivedPieces as 'intQtyreceivedPieces'
			,intrecid as 'intrecid'
			,intinvid as 'intinvid'
			,intcustomerprod as 'intcustomerprod'
			,intBlindCountId as 'intBlindCountId'

			from #tempReceivingList
	
END				