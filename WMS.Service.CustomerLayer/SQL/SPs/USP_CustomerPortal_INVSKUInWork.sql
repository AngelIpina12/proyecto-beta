USE [cargoquin]
--USE [WMSDEV]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_INVSKUInWork]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Francisco Javier Cadena Hernández
-- Create date: 12-11-2024
-- Description:	Consulta de inventario ingresado el dia de actual
-- =============================================

--CREATE PROCEDURE [dbo].[USP_CustomerPortal_INVSKUInWork]
ALTER PROCEDURE [dbo].[USP_CustomerPortal_INVSKUInWork]

----WMSPREPROD.WMSPREPRODDBV24.dbo.
----WMSPREPROD.WMSPREPRODDBV24.Security

(@intUserId INT NULL
 ,@intInvId INT NULL
 ,@strSKU VARCHAR(50) NULL
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
	 IF ( ( @isAdmin  =1 ) or (@lstrUserId='FranciscoJCH')   or (@intUserId =3025)  )
	 BEGIN
	 	       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-08-17 00:00' ) 
			   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-08-17 23:59'  ) 	     
	 END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )

--tabla  ids de inventarios main 
	CREATE TABLE #tempInv(	
	               ID int IDENTITY(1,1) PRIMARY KEY				   
				   ,intInvId int null
				   ,intIndet int null
				   ,intCustomerProduct int null
				   -- siguiente info
				   ,intProduct int null				   
				   ,strprodName varchar(50) NULL
				   ,intWorOrderId INT NULL
				   ,strWorkType VARCHAR(50) NULL
				   ,dtmStart datetime NULL
				   ,strSKUEndCustomer VARCHAR(50) NULL
				   ,strSKUSupplier VARCHAR(50) NULL				   
				   ,intTotalPieces  int NULL
				   ,strUOM VARCHAR(50) NULL
				   ,strFinalSKU VARCHAR(50) NULL
				   ,intQtyFSKUProcees INT NULL
				   ,intQtyPiecesScrap INT NULL				 			 
				   ,SalvageWorkOrderReqId INT NULL
				   )
	  --- worktable 
	  CREATE TABLE #tempInvWork(	
	               ID int IDENTITY(1,1) PRIMARY KEY				   				   
				   ,intIndet int null
				   ,intWorOrderIdF INT NULL
				   ,intWorOrderIdDet INT NULL
				   ,strWorkType VARCHAR(50) NULL
				   ,dtmStart datetime NULL
				   ,intQtyFSKUProcees INT NULL
				   ,intQtyPiecesScrap INT NULL				 			
				   ,intReqtype INT NULL
				   ,intReq int null
				   ,intReqdet int null
				   ,datfecha date null
				   ,timhora time null
				   )
		

		--- obtener los ids detalles 
		INSERT INTO #tempInv(		               
				   intInvId 
				   ,intIndet 
				   ,intCustomerProduct 
				   ,intTotalPieces 
				   ,strSKUSupplier 
				   ,SalvageWorkOrderReqId
				   )
		SELECT 
		  --intInvId ,intIndet ,intCustomerProduct 		  
		   inv.Id, idet.Id , idet.CustomerProductId

		   --,intTotalPieces ,strSKUSupplier ,
		   , idet.TotalPieces ,idet.ProductNumber
		   --SalvageWorkOrderReqId
		   ,idet.SalvageWorkOrderReqId
		FROM Inventory inv 
		 inner join InventoryDetails idet on idet.InventoryId = inv.Id
		 where inv.id = @intInvId 
		 and idet.PickingPiecesExistence > 0
	---
	
      -- cprod
	  
	  UPDATE #tempInv
	  SET 	 intProduct  = cprod.ProductId
	  FROM #tempInv tbc
	  inner join CustomerProducts cprod on cprod.Id = tbc.intCustomerProduct 
	  
	  WHERE cprod.Id = tbc.intCustomerProduct 
	  
	 
      -- productos 
	  
	  UPDATE #tempInv
	  SET 	  strSKUEndCustomer  = pro.Name	  
	         ,strUOM  = pro.ShippingUom 
			 
			 ,strprodName = pro.Name			 
			 ,strFinalSKU =  pro.Name	  	
	         
	  FROM #tempInv tbc	  
	  INNER JOIN Products pro on pro.Id =  tbc.intProduct  
	  WHERE pro.Id =  tbc.intProduct  
	  
	 
	 --- BORRAR LOS IDS QUE NO CORRESPONDAN AL SKU
	 DELETE #tempInv
	 FROM #tempInv
	 WHERE #tempInv.strSKUEndCustomer  <> @strSKU
	 -------
	 
	 --- wo
	 INSERT INTO #tempInvWork(		             
				   intIndet ,intWorOrderIdF ,strWorkType 
				   ,dtmStart 				   
				   ,intReqtype 
				   )
	 ---
	 SELECT --intIndet ,intWorOrderIdF ,strWorkType 
	         tbc.intIndet , req.Id ,retype.RequirementName
			 --,dtmStart 
	          , cast( cast( req.CurrentDate  as varchar(25) )+ ' '+cast( req.CurrentTime  as varchar(25) )   as  datetime ) ----CAST(req.CurrentDate AS DATETIME) + CAST(req.CurrentTime AS TIME) -- req.CurrentDate 			  
			  --,intReqtype 
			  ,req.RequirementTypeId
	 FROM #tempInv tbc
	 INNER JOIN Requirements req on req.Id = tbc.SalvageWorkOrderReqId
	 inner join RequirementTypes retype on retype.Id = req.RequirementTypeId
	 
	 UPDATE #tempInvWork
	 SET intQtyFSKUProcees = rdet.QtyAssigned
	     ,intQtyPiecesScrap  = rdet.QtyInInventory
	 FROM #tempInvWork tbc
	  INNER JOIN RequirementDetails rdet on rdet.RequirementId = tbc.intWorOrderIdF
	 WHERE upper(tbc.strWorkType) like '%WO%'
	  
	 -- eliminiar recs vacios
	  delete #tempInvWork
	  from #tempInvWork
	  where isnull(intWorOrderIdF ,0)=0
    -- ship
	 
	 ---SHP
	 
	 ---
	 INSERT INTO #tempInvWork(intIndet ,strWorkType )
	 SELECT tbc.intIndet , 'SHIP'
	 FROM #tempInv tbc
	 WHERE tbc.intIndet >0           
	  --
	  
	 UPDATE #tempInvWork
	 SET    intWorOrderIdDet = ( select dbo.FnGetShipDetFromInvDet(TB.intIndet) 			    
			                   )		
	 FROM #tempInvWork TB
	 WHERE TB.strWorkType ='SHIP'
--	 ---
     -- LIMPIAR LOS SHIP SIN ID 
	 delete #tempInvWork
	 from #tempInvWork tb
	 where isnull(tb.intWorOrderIdDet,0) =0
	 and tb.strWorkType ='SHIP'
	 --------
	 
	 -- ACTUALIZAR LOS SHIPS 
	 UPDATE #tempInvWork
	 SET intReq  = sdet.RequirementId
		 ,intReqdet  = sdet.ReqDetailId
		 ,intQtyFSKUProcees = sdet.AllocatedPieces
	     ,intQtyPiecesScrap  = sdet.PickedQuantity
		 ,intWorOrderIdF =sdet.ShipmentId
		 ,datfecha = sdet.RequirementDate 
		 ,timhora =sdet.RequirementTime 

	 from #tempInvWork tb
	 INNER JOIN ShipmentDetails sdet on sdet.Id = tb.intWorOrderIdDet
	 where tb.strWorkType='SHIP'

	 -- la fecha 
	 UPDATE #tempInvWork
	 --SET dtmStart = CAST(datfecha AS DATETIME) + CAST(timhora AS TIME)
	 SET dtmStart =convert(datetime, datfecha ,103) + CAST(timhora as DATETIME)
	 from #tempInvWork tb
	 INNER JOIN ShipmentDetails sdet on sdet.Id = tb.intWorOrderIdDet
	 where tb.strWorkType='SHIP'
	 and  datfecha is not null
	 and timhora is not null

	 --
	 -- ACTUALIZAR LOS SHIPS 
	 UPDATE #tempInvWork
	 SET intReq  = rqdet.RequirementId 
				   ,intReqdet  = tb.intReqdet

	 from #tempInvWork tb
	 INNER JOIN RequirementDetails rqdet on rqdet.Id = tb.intReqdet
	 where tb.strWorkType='SHIP'

	 
	 -- ACTUALIZAR LOS SHIPS 
	 UPDATE #tempInvWork
	 SET strWorkType  = rt.RequirementName	 			   
	     ,intReqtype =rq.RequirementTypeId
	 from #tempInvWork tb
	 INNER JOIN Requirements rq on rq.Id = tb.intReq
	 inner join RequirementTypes rt on rt.Id = rq.RequirementTypeId
	 where tb.strWorkType='SHIP'
	 ---------------------
	 ---- nullos
	 update #tempInvWork 
	 set intQtyFSKUProcees  =isnull(dt.intQtyFSKUProcees,0)
	  ,intQtyPiecesScrap =isnull(dt.intQtyPiecesScrap,0)
	 
	 from #tempInvWork dt 
	 where isnull(dt.intQtyFSKUProcees,0)=0
	 and  isnull(dt.intQtyPiecesScrap,0)=0
	 
	 ---------------
	    
     SELECT dt.intWorOrderIdF AS 'intWorOrderId'
	       ,dt.strWorkType  AS 'strWorkType'
		   ,dt.dtmStart  AS 'dtmStart'
		   ,M.strSKUEndCustomer AS 'strSKUEndCustomer'
		   ,M.strSKUSupplier AS 'strSKUSupplier'
		   ,M.intTotalPieces AS 'intTotalPieces'
		   ,M.strUOM AS 'strUOM'
		   ,M.strFinalSKU AS 'strFinalSKU'
		   ,SUM(dt.intQtyFSKUProcees) AS 'intQtyFSKUProcees'
		   ,SUM(dt.intQtyPiecesScrap) AS 'intQtyPiecesScrap'
	 
	 FROM #tempInv M
	 inner join #tempInvWork dt on dt.intIndet = M.intIndet
	 GROUP BY dt.intWorOrderIdF,dt.strWorkType  
		   ,dt.dtmStart  
		   ,M.strSKUEndCustomer 
		   ,M.strSKUSupplier ,M.intTotalPieces 
		   ,M.strUOM ,M.strFinalSKU 
	 ORDER BY M.intTotalPieces ASC 
	 
	 DROP TABLE #tempInv 
	 DROP TABLE #tempInvWork
	 
	 END -- BEGIN
	 --RETURN 0 
			 