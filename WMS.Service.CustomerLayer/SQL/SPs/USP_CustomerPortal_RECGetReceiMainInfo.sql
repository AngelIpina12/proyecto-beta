USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetReceiMainInfo]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetReceiMainInfo]
  --ALTER PROCEDURE [dbo].USP_CustomerPortal_RECGetReceiMainInfo]

(@strRECFolio varchar(50) -- Folio #
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

  
	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempRecInfo(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,strReceinvingFolio VARCHAR(50) NULL
				   ,strTrailerFolio VARCHAR(50) NULL
				   ,DtmReceivedDate DATETIME NULL
				   , strCity VARCHAR(50) NULL
				   , strWareHouseName VARCHAR(50) NULL
				   )
	----------------
	
	
	--insertar tabla de resultados 
		INSERT INTO #tempRecInfo(
										 --Id ,
										 strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
										,strCity
										,strWareHouseName										 
										)

	-------------------

			 SELECT 
			 		--strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
					  rts.RECFolio , rec.TRFolio , rec.ReceivingStart
				    --,strCity,strWareHouseName
				     ,addr.CityName , w.Warehouse
										
				FROM RectrailerShipments rts 				 
				 --FROM WMSPREPROD.WMSPREPRODDBV24.dbo.RecTrailers rec
				  INNER JOIN RecTrailers rec on rts.RecTrailerId= rec.Id
				  INNER JOIN  WarehouseCustomers whcust on whcust.Id = rec.WarehouseCustomerId
				  INNER JOIN Warehouses w on w.Id = rec.WarehouseId  
				  LEFT JOIN Addresses addr on addr.Id = w.AddressId
				  
				WHERE  UPPER( rts.RECFolio )= UPPER(@strRECFolio )
				Order by rec.Id ASC
		 
				
				SELECT  DISTINCT				   
				   strReceinvingFolio AS 'strReceinvingFolio'
				   ,strTrailerFolio AS 'strTrailerFolio'
				   ,DtmReceivedDate AS'DtmReceivedDate'
				   , strCity as 'strCity'
				   , strWareHouseName as 'strWareHouseName'
				
				FROM #tempRecInfo

               
	
	 END -- BEGIN
	 --RETURN 0 
