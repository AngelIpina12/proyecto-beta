--USE [WMSDEV]
USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_INVRToday]    **/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Francisco Javier Cadena Hernández
-- Create date: 07-11-2024
-- Description:	Consulta de inventario ingresado el dia de actual
-- =============================================

--CREATE PROCEDURE [dbo].[USP_CustomerPortal_INVRToday]
ALTER PROCEDURE [dbo].[USP_CustomerPortal_INVRToday]

----WMSPREPROD.WMSPREPRODDBV24.dbo.
----WMSPREPROD.WMSPREPRODDBV24.Security

(@intUserId INT NULL
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

     --DECLARE @aint_UserId int
	DECLARE @lint_WhareHouseId int

	--- otros de usuarios 
	DECLARE  @partyRoleId INT, @ExternalId INT	
	DECLARE  @isAllWareHouses INT
	DECLARE  @isAdmin INT	
	DECLARE  @strPartyRoleName varchar(100)

	DECLARE  @intRoleId INT	
	DECLARE  @intWareCustomerId INT


	DECLARE @lintfilterapllied INT --bandera general filtro aplicado en general
	DECLARE @lintDatefilterToCheck INT --bandera para saber si se va filtrar por fecha 
	declare @ldtm_ValidDate datetime
	DECLARE @ldtm_StartRange  DATETIME
	DECLARE @ldtm_EndRange  DATETIME
	DECLARE @lstrUserId VARCHAR(30) 
	DECLARE @lintCustomerId int

	set @ldtm_ValidDate ='20010101 00:00'
	set @lintCustomerId  =0

	------
	-- infor usuario	
	SELECT  @partyRoleId= us.PartyRoleId
	       ,@ExternalId  =us.ExternalTypeId
	       ,@lint_WhareHouseId =us.WarehouseId
		   ,@isAllWareHouses = us.AllWarehouses		   
		   ,@lstrUserId = us.UserId
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Users us
	FROM Security.Users us
	WHERE us.Id =@intUserId 
	--WHERE Security.Users.Id = @aint_UserId
	
	SELECT @intRoleId  =MAX (usr.RoleId)
	---FROM WMSPREPROD.WMSPREPRODDBV24.Security.UserRoles usr
	FROM Security.UserRoles usr
	WHERE  usr.UserId = @intUserId 
	--WHERE Security.UserRoles.UserId  = @aint_UserId

	--obtener los nombres del rol
	SELECT @strPartyRoleName = rol.RoleName
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Roles rol
	FROM Security.Roles rol
	WHERE rol.Id = @intRoleId  


	--- CLIENTE FINAL 
	select @lintCustomerId  = MAX(us.PartyRoleId)
	FROM Security.Users us
		 INNER JOIN Security.UserRoles usrol on usrol.UserId = us.id
		 INNER JOIN Security.Roles rol on usrol.RoleId= rol.Id 
		 INNER JOIN Customers cu on cu.Id = us.PartyRoleId
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Users us
	--	 INNER JOIN WMSPREPROD.WMSPREPRODDBV24.Security.UserRoles usrol on usrol.UserId = us.id
	--	 INNER JOIN WMSPREPROD.WMSPREPRODDBV24.Security.Roles rol on usrol.RoleId= rol.Id 
	--	 INNER JOIN WMSPREPROD.WMSPREPRODDBV24.dbo.Customers cu on cu.Id = us.PartyRoleId
	WHERE us.Id = @intUserId 

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
	 -------
	      SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )

	 -------------
	-- IF ( ( @isAdmin  =1 ) or (@lstrUserId='FranciscoJCH')   or (@intUserId =3025)  )

	IF ((@strPartyRoleName ='Admins' ) or (@lstrUserId='FranciscoJCH') or (@intUserId =3025))	
	 BEGIN
	 	       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-09-08 00:00' ) 
			   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-09-08 23:59'  ) 	     
	 END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )

	------- PARAM,ETROS VALIDACION
	--tabla recepciones
	CREATE TABLE #tempRECS(
	               ID int IDENTITY(1,1) PRIMARY KEY				   				   
				   ,intRecId INT NULL
				   ,intRecSd INT NULL
				   ,intInv INT NULL
				   )

	--tabla  ids de inventarios main 
	CREATE TABLE #tempInvM(
	               ID int IDENTITY(1,1) PRIMARY KEY				   
				   ,intInvId int null
				   ,intRecId INT NULL
				   ,intRecSd INT NULL
				   --,intWOPieces INT NULL
				   --,intPiecesAllocated INT NULL
				   --,intPiecesNotAllocated INT NULL
				 
				   )
	
    --	crear tabla de resultados 	
	CREATE TABLE #tempInvList(
	               ID int IDENTITY(1,1) PRIMARY KEY				   
				   ,strSKUEndCustomer VARCHAR(50) NULL				   
				   ,strSKUSupplier VARCHAR(50) NULL
				   ,strLot varchar(22) null
				   ,strJobNumber varchar(22) null
				   ,strWayShip VARCHAR(50) NULL
				   ,intQty int null
				   ,intBox int null
				   ,intToltalInvPieces int null
				   ,strUOM VARCHAR(20) NULL
				  ,intOnHand INT NULL
				   ,intWOPieces INT NULL
				  ,intPiecesAllocated INT NULL
				   ,intPiecesNotAllocated INT NULL
				   ,intPiecesPicked INT NULL
				   ,intPiecesShipped INT NULL
				   ,DtmReceivedDate DATETIME NULL				   
				   ,intinvid INT NULL
				   ,intProdid INT NULL
				   ,intCustomer INT NULL
				   ,intCustomerProductId INT NULL
				   ,intQualityStatusId INT NULL
				   ,intInvDet INT NULL
				   ,qsdIsActive INT NULL
				   ,qsdCanAllocate INT NULL
				   ,qsdStatusId  INT NULL
				   ,InvQualityStatusId INT NULL
				   ,qsdCategoryId INT NULL
				   ,proProductCategoryId  INT NULL
				   ,invStatusId  INT NULL
				   ,invIsLabeled   INT NULL
				   ,invTotalPieces INT NULL
				   ,qsdCustomerQualityStatusId  INT NULL
				   ,intReqId INT NULL
				   ,intReqDet INT NULL
				   ,intShipId INT NULL
				   ,intShipDet INT NULL
				   ,WorkOrder varchar(100) NULL
				   ,PickingPiecesExistence int NULL
				   ,PickingBoxesExistence int null
				   ,PiecesExistence int null
				   ,intQtyPerInv int null
				   ,intPartId INT NULL
				   ) 

		--
		INSERT INTO #tempRECS (intRecId ,intRecSd ,intInv )
		SELECT REC.Id ,RECS.Id , RECS.InventoryId
		FROM RecTrailers REC
		 INNER JOIN RecTrailerShipments RECS ON REC.Id = RECS.RecTrailerId
		 WHERE REC.ReceivingStart BETWEEN  @ldtm_StartRange   AND @ldtm_EndRange 
		GROUP BY REC.Id ,RECS.Id , REC.Id ,RECS.Id , RECS.InventoryId
	--
		 -- obtener ids bases 
		 INSERT INTO #tempInvM(
					   intInvId ,intRecId ,intRecSd 
					   )
		 SELECT inv.Id, RECS.intRecId , RECS.intRecSd
		 FROM #tempRECS RECS
			INNER JOIN Inventory inv ON RECS.intInv =inv.Id	 	
		AND inv.CustomerId= @lintCustomerId  
		GROUP BY inv.Id, RECS.intRecId , RECS.intRecSd

		--delete from #tempRECS 
		--delete from #tempInvM
		---------------------------------------------------------
		 INSERT INTO #tempInvM(
					   intInvId ,intRecId ,intRecSd 
					   )
		 SELECT  IV.Id , RECS.RecTrailerId, RECS.Id
		 FROM Inventory IV
		  INNER JOIN RecTrailerShipments RECS ON IV.Id = RECS.InventoryId

		 where IV.EntryDate BETWEEN  @ldtm_StartRange   AND @ldtm_EndRange  
		 AND IV.CustomerId =@lintCustomerId  

	--------
	---select * from #tempInvM 
	
	----------------

			 --insertar tabla de resultados 
		 INSERT INTO #tempInvList( intinvid , intInvDet 
		                         ,intCustomer 
								 , intCustomerProductId ,strLot   
								 ,strJobNumber 
								 ,DtmReceivedDate ,intQualityStatusId
								 ,InvQualityStatusId 
								,invStatusId  ,invIsLabeled   
								,invTotalPieces 
								,strSKUSupplier 
								,WorkOrder 
								,intQty 
								,intBox
								,intToltalInvPieces
								, PickingPiecesExistence
								, PickingBoxesExistence
								,intPartId 
								)

		SELECT  --intinvid , intInvDet 
		         inv.Id , INVDTT.id
		        --intCustomer 
				,inv.CustomerId
				--, intCustomerProductId ,strLot   
				,INVDTT.CustomerProductId, INVDTT.Lot 
				--,strJobNumber 
				,  INVDTT.JobNumber 
				--,DtmReceivedDate ,intQualityStatusId
				,REC.ReceivingStart ,INVDTT.QualityStatusId
				--,InvQualityStatusId 
				,INVDTT.QualityStatusId
				--,invStatusId  ,invIsLabeled   
				, INVDTT.StatusId  , INVDTT.IsLabeled
				--,invTotalPieces --strSKUSupplier 
				,INVDTT.TotalPieces , INVDTT.ProductNumber
				--WorkOrder 
				,inv.WorkOrder
				--intQty 
				,INVDTT.Pallets
				--,intBox
				,INVDTT.Boxes
				--,intToltalInvPieces 
				,INVDTT.TotalPieces
				-- PickingPiecesExistence
				, INVDTT.PickingPiecesExistence 
				--PickingBoxesExistence
				,INVDTT.PickingBoxesExistence
				--intPartId 
				,INVDTT.IndexValue
		 
		FROM #tempInvM tinv
			  INNER JOIN Inventory inv ON tinv.intInvId = inv.Id
			   INNER JOIN RecTrailerShipments RECTS ON RECTS.Id = tinv.intRecSd 
				                                     AND RECTS.InventoryId =inv.Id
				                                     
			   INNER JOIN RecTrailers REC ON REC.Id =tinv.intRecId 
				                         and  REC.Id = RECTS.RecTrailerId

			   INNER  JOIN InventoryDetails INVDTT on inv.Id = INVDTT.InventoryId
	   WHERE tinv.intInvId = inv.Id
		AND RECTS.Id = tinv.intRecSd 
		AND RECTS.InventoryId =inv.Id
		AND REC.Id =tinv.intRecId 
		AND REC.Id = RECTS.RecTrailerId
		AND inv.Id = INVDTT.InventoryId
			

			-- PART
			   
			    --SELECT TB.intinvid, TB.intInvDet ,TB.intQtyPerInv , intPartId 
				--FROM #tempInvList 	TB  
				
				   
			---
	  -- custpro
	  UPDATE #tempInvList	  
	  SET 	intProdid  = cuprod.ProductId	       
	  FROM #tempInvList tbc	  
	  INNER JOIN CustomerProducts cuprod on cuprod.Id = tbc.intCustomerProductId 
	  WHERE cuprod.Id = tbc.intCustomerProductId 
	  
	 
	 
      -- productos 
	  
	  UPDATE #tempInvList
	  SET 	  strSKUEndCustomer  = pro.Name	  
	         ,strUOM  = pro.ShippingUom 
			 ,intProdid  = pro.Id
	         ,proProductCategoryId  =pro.ProductCategoryId
	  FROM #tempInvList tbc
	  INNER JOIN Products pro on pro.Id = tbc.intProdid  
	  WHERE pro.Id = tbc.intProdid  
	 
	 
			 
			  --qsdCustomerQualityStatusId  		  

			  update #tempInvList 
			  set  qsdCustomerQualityStatusId   = cqs.Id		
			  from   #tempInvList lt
			   INNER JOIN CustomerQualityStatus cqs  on  cqs.CustomerId = lt.intCustomer
			  WHERE cqs.CustomerId = lt.intCustomer

			  -- --- qualitystat---QualityStatusDetails 
			  update #tempInvList 			
			   set  qsdIsActive =qsd.IsActive 
				   ,qsdCanAllocate =qsd.CanAllocate
				   ,qsdStatusId  =qsd.StatusId  				   
				   ,qsdCategoryId =qsd.CategoryId 				   			

			  from   #tempInvList lt
			   INNER  JOIN QualityStatusDetails qsd  on qsd.CustomerQualityStatusId = lt.qsdCustomerQualityStatusId   
				                                   AND qsd.IsActive =1
												   AND qsd.StatusId = lt.InvQualityStatusId 
												   and qsd.CanAllocate =1 

			  where  qsd.CustomerQualityStatusId = lt.qsdCustomerQualityStatusId   
			  AND qsd.IsActive =1
			  AND qsd.StatusId = lt.InvQualityStatusId 
			  and qsd.CanAllocate =1 
				
			  
	   ---
	     --*,strWayShip 
		 UPDATE #tempInvList 
		   SET  strWayShip  = (
		                              case when tb.strUOM= 2 then 'Pallets' 
									       when tb.strUOM= 3 then 'pieces' 
									else 'Boxes' end
		                          )		  
		from #tempInvList tb
		WHERE tb.intinvid >0
		--	
		--
		
		--intOnHand
		CREATE TABLE #tbHand
		(
		   idbase int 
		   ,intInvdet INT NULL
		   ,intHandPiecesQty INT NULL
		
		)

		INSERT INTO #tbHand
		( idbase ,intInvdet 
		,intHandPiecesQty
		)

		SELECT IT.ID , IT.intInvDet
		, 		(case when IT.invStatusId in(121/*Approved*/, 131/*Not Approved*/) 
		              and IT.invIsLabeled= 1 
					  and  cqAvail.id is not null  
				  then  IT.invTotalPieces else 0 end) 


		FROM #tempInvList IT 
		  outer apply
		    (
		    select top 1 StatusId[Id] from CustomerQualityStatus cqs
		    inner join QualityStatusDetails qsd on qsd.CustomerQualityStatusId = cqs.Id
		    where cqs.CustomerId = IT.intCustomer and qsd.IsActive = 1 and CanAllocate = 1 and qsd.StatusId = IT.InvQualityStatusId
		    and isnull(qsd.CategoryId, 0) = case when isnull(qsd.CategoryId, 0) = 0 then isnull(qsd.CategoryId, 0) else IT.proProductCategoryId end
		    )cqAvail
		
		---
		UPDATE #tempInvList 
		 set intOnHand = th.intHandPiecesQty
		FROM #tempInvList  tb
		inner join  #tbHand  th on tb.intInvDet = tb.intInvDet
		where th.intHandPiecesQty > 0

		---

		DROP TABLE #tbHand

		-- UPDATE #tempInvList 
		 --  SET  intOnHand= ( 
		--							  (CASE WHEN (
		--							                              tbc.qsdIsActive =1 
		--														  and tbc.qsdCanAllocate =1 
		--														  and tbc.qsdStatusId = tbc.InvQualityStatusId
		--														  
		--														 and isnull(tbc.qsdCategoryId, 0) = ( case when isnull(tbc.proProductCategoryId, 0) = 0 
		--														                                              then isnull(tbc.proProductCategoryId, 0)
		--																								else tbc.proProductCategoryId
		--																							end)
		--													    and tbc.invStatusId in(121/*Approved*/, 131/*Not Approved*/) 
		--														and tbc.invIsLabeled =1 
		--														)
			--												then tbc.invTotalPieces
		--												    ELSE 0 
		--													END
	   --								)
									  
	   --							)
		--	FROM #tempInvList  tbc
		--	where tbc.intinvid >0						
			
			
			---
			--,intReqId INT NULL
			UPDATE #tempInvList   
			SET intReqId  = rq.id

			FROM #tempInvList    tbc
			 INNER JOIN Requirements rq ON rq.WorkOrder COLLATE SQL_Latin1_General_CP1_CI_AS= tbc.WorkOrder  COLLATE SQL_Latin1_General_CP1_CI_AS
			 where tbc.intinvid > 0
			 and isnull(tbc.WorkOrder ,'') >1

			--	   ,intReqDet INT NULL
			UPDATE #tempInvList   
			SET intReqDet = rdt.id
			FROM #tempInvList    tbc
			 INNER JOIN RequirementDetails rdt ON rdt.RequirementId = tbc.intReqId			 
			                                 and rdt.CustomerProductId = tbc.intCustomerProductId
			 where tbc.intinvid > 0

			 -- ship 

		 	--	   ,intShipDet INT NULL
			----FnGetShipDetFromInvDet
			
			--UPDATE #tempInvList     
		    --SET  intShipDet   =  ( select dbo.FnGetShipDetFromInvDet(tbc.intInvDet) 			    
			  --                   )				
			 --FROM #tempInvList    tbc			 			 
			 --where tbc.intinvid > 0
			 --AND tbc.intInvDet > 0
			 --AND ISNULL(intShipDet,0) =intShipDet   

			 
				  declare @lint_ship int 
				  declare @lint_shipDT int 
				  declare @lint_ident int 
				  
				  set @lint_ship  = 0 
				  set @lint_shipDT  = 0 

				  --select * from #tempInv 
	  
				  declare lcr_indet CURSOR FOR
				  SELECT tb.intInvDet
				  FROM #tempInvList TB
				  


				  OPEN lcr_indet 
				  FETCH NEXT FROM lcr_indet INTO @lint_ident 

				  WHILE @@FETCH_STATUS =0
				  BEGIN
						SET @lint_ident =NULL

						 IF EXISTS (
						             SELECT #tempInvList.ID
									 FROM #tempInvList
									 WHERE #tempInvList.intInvDet = @lint_ident 
									 AND ISNULL(#tempInvList.intShipDet,0)=0
									 AND ISNULL(#tempInvList.intShipId,0)=0
						           )
								   begin
								   
										SELECT @lint_shipDT= sh.Id
											   ,@lint_ship  = sh.ShipmentId
	
										FROM ShipmentDetails sh
										WHERE sh.InventoryDetailId = @lint_ident 

								   end

						

						 SET @lint_ship   = ISNULL(@lint_ship  ,0)
						 SET @lint_shipDT = ISNULL(@lint_shipDT,0)

						 IF ( @lint_ship   >0  and @lint_shipDT >0 )
						 BEGIN

						  IF EXISTS (
						             SELECT #tempInvList.ID
									 FROM #tempInvList
									 WHERE #tempInvList.intInvDet = @lint_ident 
									 AND ISNULL(#tempInvList.intShipDet,0)=0
									 AND ISNULL(#tempInvList.intShipId,0)=0
						           )
								   BEGIN
								            ----- actualizar shipid 
										   update #tempInvList 
											  set intShipId =   @lint_ship  
												 ,intShipDet = @lint_shipDT  
											  from #tempInvList TB
											  where TB.intInvDet = @lint_ident  
											  ----
											  -- buscar todos los shipdets con el mismo id 
											  UPDATE #tempInvList
											  SET intShipId =   tb.intShipId
												 ,intShipDet  = tb.intShipDet
											  FROM #tempInvList tb
											   INNER JOIN ShipmentDetails shd on shd.InventoryDetailId = tb.intShipDet
											  WHERE   shd.InventoryDetailId = tb.intShipDet
											 and   shd.ShipmentId =  @lint_ship
										 -----

								   END 
						  
						  ------
						 END --
			 	

					FETCH NEXT FROM lcr_indet INTO @lint_ident 

				  END -- CURSOR
				  CLOSE lcr_indet 
				  DEALLOCATE lcr_indet

			 ---------------


			---intPiecesPicked
			-- intPiecesShipped 

			UPDATE #tempInvList   
			SET intShipId= shdet.ShipmentId
			  , intPiecesPicked  = shdet.PickedQuantity 
			  , intPiecesShipped = (case when tbc.invStatusId= 126 then 1 else 0 end)			  
				-- SI NO TIENE RQ. ACTUALIZAR
			  , intReqDet = (case when isnull(intReqDet ,0) =0 then shdet.ReqDetailId   else intReqDet  end)			  
			  , intReqId = (case when isnull(intReqId ,0) = 0 then shdet.RequirementId else intReqId end)	
			  , intPiecesAllocated = shdet.AllocatedPieces
			FROM #tempInvList    tbc
			 INNER JOIN ShipmentDetails shdet  ON shdet.Id= tbc.intShipDet 
			 where shdet.Id= tbc.intShipDet 
			
			
		

			---intPiecesAllocated
			UPDATE #tempInvList     
		    SET  intWOPieces  =  rdt.QtyInInventory
			    ,intPiecesAllocated =  case when isnull(intPiecesAllocated ,0) =0 then rdt.QtyAssigned 
				                        else intPiecesAllocated 
										end
				
			 FROM #tempInvList    tbc			 
			 INNER JOIN RequirementDetails rdt ON rdt.Id = tbc.intReqDet
			 where tbc.intinvid > 0
			---
		
			
			---


			---, intWOPieces = intWOPieces + shd
			--,intPiecesAllocated = rdt.QtyAssigned 
			--intPiecesShipped 
			UPDATE #tempInvList   
			SET intWOPieces = isnull(tbc.intWOPieces,0)  +PickingPiecesExistence 
			  ,  intPiecesShipped = (case when tbc.invStatusId= 126 then 1 else 0 end)	
			 
			FROM #tempInvList    tbc			 
			 where tbc.intinvid > 0
			 AND isnull(tbc.intWOPieces,0)   =0

			 -- nulls
			 
			UPDATE #tempInvList     
		    SET  intWOPieces = ISNULL(intWOPieces,0) 
			    ,intPiecesAllocated =ISNULL(intPiecesAllocated,0)
			   ,intPiecesShipped =ISNULL(intPiecesShipped ,0)
			 FROM #tempInvList    tbc		
			 where tbc.intinvid > 0
			--- notallocated


			UPDATE #tempInvList     
		    SET  intPiecesNotAllocated =  (  CASE WHEN ( tbc.intWOPieces> tbc.intPiecesAllocated) THEN  tbc.intWOPieces - tbc.intPiecesAllocated	
			                                  ELSE 
											 0
											 END
											)
			 FROM #tempInvList    tbc		
			 where tbc.intinvid > 0
			---

			---------------

	
		 -------
		 
		  UPDATE #tempInvList  
		  SET intPiecesAllocated  = isnull(intPiecesAllocated ,0) 
		     ,intPiecesNotAllocated  = isnull(intPiecesNotAllocated ,0)
		  FROM #tempInvList  tm
		  WHERE isnull(tm.intPiecesAllocated ,0) =0
		  or isnull(tm.intPiecesNotAllocated ,0)=0

		 ---------
			  
			  -------------------
			
		 SELECT
		     (select MAX(t2.ID)
			 FROM #tempInvList t2
			 where t2.intinvid= td.intinvid 
			 and t2.strSKUEndCustomer= td.strSKUEndCustomer
			 ) as 'id'
			 
		      ,strSKUEndCustomer AS 'strSKUEndCustomer' 
		      ,strSKUSupplier AS 'strSKUSupplier'
			  ,strLot AS 'strLot'
			  ,isnull(strJobNumber,'N-A') AS 'strJobNumber'
			  ,strWayShip AS 'strWayShip'
				   ,isnull(sum(intQty),0) AS'intQty'
				   ,isnull(sum(intBox) ,0)AS'intBox'
				   ,isnull(sum(intToltalInvPieces ),0) AS 'intToltalInvPieces'
				   ,strUOM AS'strUOM'
				   ,isnull(sum(intOnHand  ),0)AS'intOnHand'
				   ,isnull(sum(intWOPieces) ,0) AS'intWOPieces'
				   ,isnull(sum(intPiecesAllocated ),0) AS'intPiecesAllocated'
				   ,isnull(sum(intPiecesNotAllocated) ,0)AS 'intPiecesNotAllocated'
				   ,isnull(sum(intPiecesPicked),0) AS'intPiecesPicked'
				   ,isnull(sum(intPiecesShipped ),0)AS 'intPiecesShipped'
				   ,DtmReceivedDate AS 'DtmReceivedDate'
				   ,td.intinvid AS 'intinvid'
				   --,td.intShipDet
		   
		  FROM #tempInvList td
		  INNER JOIN #tempInvM tm on tm.intInvId = td.intinvid 
		  GROUP BY  strSKUEndCustomer 
		      ,strSKUSupplier 
			,strLot 
			 ,strJobNumber 
			,strWayShip 
				  -- ,intQty 
				   ---,intBox 
				--   ,intToltalInvPieces 
				   ,strUOM 
				  -- ,intOnHand 
				   --,intWOPieces 
				   --,intPiecesAllocated 
				   --,intPiecesNotAllocated 
				   --,intPiecesPicked 
				   --,intPiecesShipped
				   ,DtmReceivedDate 
				   ,td.intinvid 
		          --,td.intShipDet
		 ORDER BY DtmReceivedDate  ASC
		 
	 DROP TABLE #tempRECS
	 DROP TABLE #tempInvM
	 DROP TABLE #tempInvList
	 END -- BEGIN
	 --RETURN 0 
			 