USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetListbyRecFolio]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetListbyRecFolio]
  ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetListbyRecFolio]

(@strRECFolio varchar(50) -- Folio #
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

  

	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempReceivingList(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,strReceinvingFolio VARCHAR(50) NULL
				   ,strTrailerFolio VARCHAR(50) NULL
				   ,DtmReceivedDate DATETIME NULL
				   ,strSKU VARCHAR(50) NULL
				   ,strWayofShipping VARCHAR(20) NULL
				   ,decQtyPallets decimal(9,3) NULL
				   ,decBoxes decimal(9,3) NULL
				   ,strSupplierName VARCHAR(120) NULL
				   ,strStatus VARCHAR(120) NULL
				   ,strOSD VARCHAR(20) NULL
				   ,strEndCustomerName VARCHAR(120) NULL
				   ,intQtyreceivedPieces INT NULL
				   ,intrecid INT NULL
				   ,intinvid INT NULL
				   , intcustomerprod int NULL
				   ,intRectrairleShipmentID int null
				   )
	----------------
	
	
	--insertar tabla de resultados 
		INSERT INTO #tempReceivingList(
										 --Id ,
										 strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
										 ,strSKU ,strWayofShipping ,decQtyPallets 
										 ,decBoxes ,strSupplierName ,strStatus 
										 ,strOSD ,strEndCustomerName , intQtyreceivedPieces 
										 ,intrecid ,intinvid  ,intcustomerprod 
										 ,intRectrairleShipmentID 
										 
										)

	-------------------

			 SELECT 
			 		--strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
					rts.RECFolio , rec.TRFolio , rec.ReceivingStart
					-- ,strSKU 
					,prod.Name[SKU]
					--,strWayofShipping 
					,
					(
					                    case when  (SELECT MAX (prod.shippinguom )) = 2 then 'Pallets' 
										     when  (SELECT MAX (prod.shippinguom ))= 3 then 'pieces' 
										 else 'Boxes' end             		                   
					                 )

					--,decQtyPallets 
					, --rec.TotalPallets 
					 (
					 --0
					  --SELECT sum(BLC.Pallets )					  
					  --FROM InventoryDetails invdetIN 
					  --INNER JOIN BlindCounts BLC ON BLC.Id  = invdetIN.BlindCountId  
					  --WHERE invdetIN.InventoryId = inv.Id
					  --AND  invdetIN.CustomerProductId = invdet.CustomerProductId
					  
					  SELECT SUM(BCD.Pallets)
					  FROM BlindCounts BCD
					  WHERE BCD.RecTrailerShipmentId = rts.Id


					 )
					 -- ,decBoxes 
					, --rec.TotalBoxes
					 (
						-- SELECT sum(BLC.Boxes )					  
						--  FROM InventoryDetails invdetIN 
						--  INNER JOIN BlindCounts BLC ON BLC.Id  = invdetIN.BlindCountId  
						--  WHERE invdetIN.InventoryId = inv.Id
						--  AND  invdetIN.CustomerProductId = invdet.CustomerProductId

						SELECT SUM(BCD.Boxes )
						FROM BlindCounts BCD
						WHERE BCD.RecTrailerShipmentId = rts.Id

					  )
					--,strSupplierName ,strStatus 
					, sup.Name, RecepStat.Status
					--	 ,strOSD 
					,( 
					
					  --SELECT max(convert(varchar(12),BLC.OverageOrShortageQty))
					  --FROM InventoryDetails invdetIN 
						--  INNER JOIN BlindCounts BLC ON BLC.Id  = invdetIN.BlindCountId  
						 -- WHERE invdetIN.InventoryId = inv.Id
						 -- AND  invdetIN.CustomerProductId = invdet.CustomerProductId

						 SELECT max(convert(varchar(12),BCD.OverageOrShortageQty))
						FROM BlindCounts BCD
						WHERE BCD.RecTrailerShipmentId = rts.Id

					)
					--- ,strEndCustomerName 
					,custrts.Name -----,cust.Name 
					---,intQtyreceivedPieces 
					,--rts.OriginalBoxesIn *rts.OriginalPalletsIn 
					 (
					  --SELECT max(BLC.Pieces)
				      --FROM InventoryDetails invdetIN 
						--  INNER JOIN BlindCounts BLC ON BLC.Id  = invdetIN.BlindCountId  
						 -- WHERE invdetIN.InventoryId = inv.Id
						  --AND  invdetIN.CustomerProductId = invdet.CustomerProductId		

						  SELECT  SUM(BCD.Pieces) 
						FROM BlindCounts BCD
						WHERE BCD.RecTrailerShipmentId = rts.Id



		            )

		--,intrecid ,intinvid 
		,rec.Id  , inv.Id		
		--
		--intcustomerprod 
		, BCM.CustomerProductId ---,invdet.CustomerProductId
		--intRectrairleShipmentID 
		 ,rts.Id

				 FROM RecTrailers rec
				 -- ---- --- FROM WMSPREPROD.WMSPREPRODDBV24.dbo.RecTrailers rec
				  INNER JOIN RectrailerShipments rts on rts.RecTrailerId= rec.Id
				  INNER JOIN Inventory inv on inv.Id = rts.InventoryId 
				  --INNER JOIN InventoryDetails invdet on invdet.InventoryId = inv.Id
				  LEFT JOIN BlindCounts BCM  ON BCM.RecTrailerShipmentId = rts.Id
				 INNER JOIN CustomerProducts custprod on custprod.Id = BCM.CustomerProductId --- invdet.CustomerProductId
				  INNER JOIN Products prod on prod.Id = custprod.ProductId

				  INNER JOIN Customers cust on cust.WarehouseCustomerId = rec.WarehouseCustomerId
				                            and cust.Id = custprod.CustomerId
				 
				  INNER JOIN CustomerSuppliers cusup on cusup.CustomerId = cust .Id
				                                     and cusup.SupplierId  =  BCM.SupplierId  -- invdet.SupplierId = 

				  inner join Customers custrts on custrts.Id = rts.CustomerId
				  INNER JOIN  Suppliers sup on sup.Id =cusup .SupplierId

				  INNER JOIN Customers custrect on custrect.Id = rec.WarehouseCustomerId

				  LEFT JOIN  StatusTypes RecepStat  on   RecepStat.Id =  rec.TrStatus				 
				
				WHERE  UPPER( rts.RECFolio )= UPPER(@strRECFolio )
					
				GROUP BY rts.RECFolio , rec.TRFolio , rec.ReceivingStart, prod.Name
					, sup.Name, RecepStat.Status
					,rec.Id  , inv.Id , BCM.CustomerProductId ---invdet.CustomerProductId
					,  custrts.Name -- ,cust.Name 
					,rts.Id 
					Order by rec.Id ASC
		 
				
					
					

				   SELECT  DISTINCT
					strReceinvingFolio as 'strReceinvingFolio'
					,DtmReceivedDate as 'dtmReceivedDate'
					,strSKU AS 'strSKU'
					,strSupplierName AS 'strSupplierName'
					,strWayofShipping AS 'strWayofShipping'
					,decQtyPallets AS 'decQtyPallets'
					,decBoxes AS 'decBoxes'
					,intQtyreceivedPieces AS 'intQtyreceivedPieces'
					,strOSD AS 'strOSD'
					,strTrailerFolio AS 'strTrailerFolio'
					,strEndCustomerName AS 'strEndCustomerName'
					,strStatus as 'strStatus'
					--,intrecid ,intinvid  , intcustomerprod
				from #tempReceivingList
				

               
	
	 END -- BEGIN
	 --RETURN 0 
			