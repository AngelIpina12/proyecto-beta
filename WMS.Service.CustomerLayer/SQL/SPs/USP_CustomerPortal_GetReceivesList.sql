USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetReceivesList]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--CREATE PROCEDURE [dbo].[USP_CustomerPortal_GetReceivesList]
  ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetReceivesList]

(@UserId INT
 ,@intIsToday INT = NULL
 ,@intIsTrailerFolio INT = NULL
 ,@strTrailerFolio varchar(50) -- Folio #
 ,@intIsEndCustomer INT = NULL
 ,@intEndCustomerId INT = NULL
 ,@intIsForSKU INT = NULL
 ,@strSKU VARCHAR(50) NULL
 ,@intIsSupplier INT = NULL
 ,@intSupplierId INT = NULL
 ,@dtmStartDate datetime = NULL
 ,@dtmEndDate   datetime =NULL

)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

     --DECLARE @aint_UserId int
	DECLARE @lint_WhareHouseId int
	DECLARE @ldtm_StartRange DATETIME --rango para query
	DECLARE @ldtm_EndRange DATETIME --rango para query

	--- otros de usuarios 
	DECLARE  @partyRoleId INT, @ExternalId INT	
	DECLARE  @isAllWareHouses INT
	DECLARE  @isAdmin INT	
	DECLARE  @strPartyRoleName varchar(100)
	DECLARE  @strCustomerName  varchar(100)
	DECLARE  @intRoleId INT	
	DECLARE  @intWareCustomerId INT

	DECLARE @lintfilterapllied INT --bandera general filtro aplicado en general
	DECLARE @lintDatefilterToCheck INT --bandera para saber si se va filtrar por fecha 
	declare @ldtm_ValidDate datetime
	set @ldtm_ValidDate ='20010101 00:00'

	------
	-- infor usuario	
	SELECT  @partyRoleId= us.PartyRoleId
	       ,@ExternalId  =us.ExternalTypeId
	       ,@lint_WhareHouseId =us.WarehouseId
		   ,@isAllWareHouses = us.AllWarehouses
		   
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Users us
	FROM Security.Users us
	WHERE us.Id = @UserId
	--WHERE Security.Users.Id = @aint_UserId
	
	SELECT @intRoleId  =MAX (usr.RoleId)
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.UserRoles usr
	FROM Security.UserRoles usr
	WHERE  usr.UserId = @UserId
	--WHERE Security.UserRoles.UserId  = @aint_UserId

	--obtener los nombres del rol
	SELECT @strPartyRoleName = rol.RoleName
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Roles rol
	FROM Security.Roles rol
	WHERE rol.Id = @intRoleId  

		  --- obtener cliente
	 SELECT @strCustomerName = cust.Name
	  ---obtener cliente de almacen
	      , @intWareCustomerId  = cust.WarehouseCustomerId
	 --FROM WMSPREPROD.WMSPREPRODDBV24.dbo.Customers cust
	 FROM Customers cust
	 WHERE cust.Id =  @partyRoleId

	--- SI ES admins obtener marcarlo
	
	 IF (@strPartyRoleName ='Admins')
	  BEGIN
	   SET @isAdmin =1
	  END 
	----
	 -- SI EL @intWareCustomerId ES O , HACERLO NULL
	 IF ( @intWareCustomerId=0)
	 BEGIN
	  SET @intWareCustomerId = NULL
	 END 

	  
	--
	-- inicializar banderas 
	 SET @lintfilterapllied=0
	 set @lintDatefilterToCheck =0
	 ----------
     

	 IF (@intIsToday =1)
	 BEGIN
	 
	      SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )

		  IF (@UserId =3025)
		  BEGIN
		       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-09-08 00:00' ) 
			   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-09-08 23:59'  ) 	     
		  END 

	        
		  SET @strTrailerFolio =NULL
		  SET @intEndCustomerId  = NULL
		  SET @strSKU =NULL
		  SET @intSupplierId =NULL
		  SET @lintfilterapllied =1 
   
	 END --IF (@intIsToday =1)

	 -- (@intIsTrailerFolio  =1) 
	 IF  ( (@lintfilterapllied =0) AND (@intIsTrailerFolio  =1) ) 
	 BEGIN
	      --SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  --SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
	        
		  SET @strTrailerFolio =ISNULL(@strTrailerFolio ,'')
		  SET @intEndCustomerId  = NULL
		  SET @strSKU =NULL
		  SET @intSupplierId =NULL
		  SET @lintfilterapllied =1 
   
	 END -- (@intIsTrailerFolio  =1) 

	 	 -- (@intIsEndCustomer  =1) 
	 IF  ( (@lintfilterapllied =0) AND (@intIsEndCustomer  =1) ) 
	 BEGIN
	      --SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  --SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
	        
		  SET @strTrailerFolio = NULL
		  SET @intEndCustomerId  = ISNULL(@intEndCustomerId,0)
		  SET @strSKU =NULL
		  SET @intSupplierId =NULL
		  SET @lintfilterapllied =1 
   
	 END -- (intIsEndCustomer  =1) 


	 ---intIsForSKU
	 ------------------
	 IF  ( (@lintfilterapllied =0) AND (@intIsForSKU  =1) ) 
	 BEGIN
	      --SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  --SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
	        
		  SET @strTrailerFolio = NULL
		  SET @intEndCustomerId  = NULL
		  SET @strSKU =ISNULL(@strSKU ,'')
		  SET @intSupplierId =NULL
		  SET @lintfilterapllied =1 
   
	 END -- (intIsForSKU  =1) 

	 --intIsSupplier
	 --------------------------
	 IF  ( (@lintfilterapllied =0) AND (@intIsSupplier=1) ) 
	 BEGIN
	      --SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  --SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
	        
		  SET @strTrailerFolio = NULL
		  SET @intEndCustomerId  = NULL
		  SET @strSKU =NULL
		  SET @intSupplierId =ISNULL(@intSupplierId,0)
		  SET @lintfilterapllied =1 
   
	 END -- (intIsSupplier=1) 
	 -----------------------

     IF (   ( @dtmStartDate> @ldtm_ValidDate ) AND (@dtmEndDate   >  @ldtm_ValidDate)  AND (@lintfilterapllied =0) )
	 BEGIN
	 
	    --set @ldtm_StartRange= @dtmStartDate
		SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate ) )

		SET  @ldtm_EndRange = CONVERT(DATETIME , CONVERT( DATE, @dtmEndDate ) )

		set  @ldtm_EndRange =DATEADD(hh, 23, @ldtm_EndRange  )
		set  @ldtm_EndRange =DATEADD(mi, 59, @ldtm_EndRange  )

		
	    --set @ldtm_EndRange  =@dtmEndDate   
		set @lintfilterapllied =1
		---
		set @strTrailerFolio = NULL
		SET @intEndCustomerId  = NULL
		SET @strSKU = NULL
		SET @intSupplierId = NULL

	 END 


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

				   )
	----------------
	--strReceinvingFolio = RectrailerShipments .RECFolio
	
	-- si se aplico filtro
	 IF ( @lintfilterapllied =1)
	 BEGIN
			 --insertar tabla de resultados 
		INSERT INTO #tempReceivingList(
										 --Id ,
										 strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
										 ,strSKU ,strWayofShipping ,decQtyPallets 
										 ,decBoxes ,strSupplierName ,strStatus 
										 ,strOSD ,strEndCustomerName , intQtyreceivedPieces 
										)

	-------------------

			 SELECT 
			 		--strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
					rts.RECFolio , rec.TRFolio , rec.ReceivingStart
					-- ,strSKU ,strWayofShipping 
					,prod.Name[SKU], (
					                    case when prod.shippinguom = 2 then 'Pallets' 
										     when prod.ShippingUom= 3 then 'pieces' 
										 else 'Boxes' end             		                   
					                 )

					--,decQtyPallets 
					, --rec.TotalPallets 
					 (
					  SELECT max(BLC.Pallets )
					  FROM BlindCounts BLC
					  WHERE BLC.Id = invdet.BlindCountId 
					 )
					 -- ,decBoxes 
					, --rec.TotalBoxes
					 (
						  SELECT max(BLC.Boxes )
						  FROM BlindCounts BLC
						  WHERE BLC.Id = invdet.BlindCountId 
					  )
					--,strSupplierName ,strStatus 
					, sup.Name, RecepStat.Status
					--	 ,strOSD 
					,( 
					 SELECT max(convert(varchar(12),BLC.OverageOrShortageQty))
					 FROM BlindCounts BLC
					 WHERE BLC.Id = invdet.BlindCountId
					)
					--- ,strEndCustomerName 
					,cust.Name 
					---,intQtyreceivedPieces 
					,--rts.OriginalBoxesIn *rts.OriginalPalletsIn 
					 (
					 SELECT max(BLC.Pieces)
					 FROM BlindCounts BLC
					 WHERE BLC.Id = invdet.BlindCountId )

				 FROM RecTrailers rec
				 --FROM WMSPREPROD.WMSPREPRODDBV24.dbo.RecTrailers rec
				  INNER JOIN RectrailerShipments rts on rts.RecTrailerId= rec.Id
				  INNER JOIN Inventory inv on inv.Id = rts.InventoryId 
				  INNER JOIN InventoryDetails invdet on invdet.InventoryId = inv.Id
				 INNER JOIN CustomerProducts custprod on custprod.Id = invdet.CustomerProductId
				  INNER JOIN Products prod on prod.Id = custprod.ProductId

				  INNER JOIN Customers cust on cust.WarehouseCustomerId = rec.WarehouseCustomerId
				                            and cust.Id = custprod.CustomerId
				  INNER JOIN CustomerSuppliers cusup on cusup.CustomerId = cust .Id
				                                     and invdet.SupplierId = cusup.SupplierId   
				  INNER JOIN  Suppliers sup on sup.Id =cusup .SupplierId

				  LEFT JOIN  StatusTypes RecepStat  on   RecepStat.Id =  rec.TrStatus
				 

				 
				
				WHERE  -- filtros fijos primero
				--CUSTOMER
				  rec.SingleCustomerId = ISNULL(@partyRoleId,rec.SingleCustomerId )
				-- WAREHOUSECUSTOMER
				AND rec.WarehouseCustomerId  = ISNULL(@intWareCustomerId ,rec.WarehouseCustomerId)

				-- WAREHOUSE
				AND ( ( rec.WarehouseId = @lint_WhareHouseId )
					   or
					   ( @isAdmin  =1 )
					)

               -- FILTROS PERSONALIZADOS
			   AND (
					  -- si no hay filtro de fecha es por algun tipo de filtro
					 (
					  -- que tengan el filtro general aplicado
					   @lintfilterapllied =1
					 --  AND   @lintDatefilterToCheck =0 -- no filtro de fecha
					 ---AND RecTrailers.ReceivingStart between  @ldtm_StartRange and @ldtm_EndRange 
					  AND rec.ReceivingStart between  ISNULL(@ldtm_StartRange ,rec.ReceivingStart )and ISNULL(@ldtm_EndRange ,rec.ReceivingStart )
					   -- DEMAS FILTROS 
					   AND rec.TRFolio = ISNULL( @strTrailerFolio , rec.TRFolio )
					   AND cust.Id = ISNULL(@intEndCustomerId  ,cust.Id )
					   and prod.Name = ISNULL(@strSKU , prod.Name )
					   and  sup.Id = ISNULL(@intSupplierId, sup.Id)
					   
					 )
			       )		       		
			
			Order by rec.Id ASC
				
				if (@intIsToday =1) 
					BEGIN

					 SELECT DtmReceivedDate as 'dtmReceivedDate'
					        ,strReceinvingFolio as 'strReceinvingFolio'
							,strTrailerFolio as 'strTrailerFolio'
					 FROM #tempReceivingList
					 GROUP BY DtmReceivedDate ,strReceinvingFolio,strTrailerFolio

					 RETURN 0


					END --@intIsToday =1
				ELSE
				   BEGIN
	

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
				from #tempReceivingList

				--group by strReceinvingFolio
				---,DtmReceivedDate ,strSKU,strSupplierName,strWayofShipping,decQtyPallets
				--,decBoxes,intQtyreceivedPieces,strOSD,strTrailerFolio,strEndCustomerName


				   END -- ELSE @intIsToday =1
				
               
			
	 END --IF ( @lintfilterapllied =1)
	 
	 END -- BEGIN
	 --RETURN 0 
			