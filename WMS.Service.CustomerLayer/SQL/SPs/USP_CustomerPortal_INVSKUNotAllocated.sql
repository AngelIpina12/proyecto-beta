USE [cargoquin]
--USE [WMSDEV]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_INVSKUNotAllocated]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Francisco Javier Cadena Hernández
-- Create date: 15-11-2024
-- Description:	Consulta de skus No asignados 
-- =============================================

--CREATE PROCEDURE [dbo].[USP_CustomerPortal_INVSKUNotAllocated]
ALTER PROCEDURE [dbo].[USP_CustomerPortal_INVSKUNotAllocated]

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
	 --IF ( ( @isAdmin  =1 ) or (@lstrUserId='FranciscoJCH')   or (@intUserId =3025)  )
	 --BEGIN
	 --	       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-08-17 00:00' ) 
	--		   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-08-17 23:59'  ) 	     
	 --END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )

--tabla  ids de inventarios main 
	CREATE TABLE #tempInv(	
	               ID int IDENTITY(1,1) PRIMARY KEY				   
				   ,intInvId int null
				   ,intIndet int null
				   ,intCustomerProduct int null
				   -- siguiente info
				   ,intProduct int null				   
				   ,strprodName varchar(50) NULL
				   ,strSKU varchar(50) NULL
				   ,strSKUEndCustomer VARCHAR (50) NULL
				   ,intCustomerId INT NULL
				   ,intSupplierId INT NULL
				   ,strSupplierName VARCHAR(50) NULL
				   ,dtmQADate datetime null			   
				   
				   ,intQualityStatus INT NULL
				   ,strQAStatus VARCHAR(100) NULL
				   ,intStatus INT NULL
				   ,strStatus VARCHAR(100) NULL
				   ,intWorOrderId INT NULL
				   ,strWorkType VARCHAR(50) NULL				   
				   ,SalvageWorkOrderReqId INT NULL
				   ,invqualityid INT NULL
				   ,strinvquality varchar(30) null
				   ,intprouomid int null
				   ,inthaswork int null
				   ,intQty INT NULL
				   
				   )
	  

		--- obtener los ids detalles 
		INSERT INTO #tempInv(		               
				   intInvId ,intIndet ,intCustomerProduct 				   				   
				   ,SalvageWorkOrderReqId ,intStatus ,invqualityid 
				   ,strinvquality ,inthaswork 
				   ,intCustomerId ,intSupplierId
				   ,strSupplierName ,intQty
				   ,strQAStatus
				   )
		SELECT 
		  --intInvId ,intIndet ,intCustomerProduct 		  
		   inv.Id, idet.Id , idet.CustomerProductId
		   --SalvageWorkOrderReqId ,intStatus  ,invqualityid 
		   ,idet.SalvageWorkOrderReqId , idet.StatusId ,idet.QualityStatusId
		   --strinvquality  --inthaswork 
		   ,idet.QualityStatus ,isnull(idet.SalvageWorkOrderReqId ,0)
		   --,intCustomerId ,intSupplierId
		   ,inv.CustomerId , SupplierId
		   ---strSupplierName , 
		   ,SupplierName ,idet.PiecesExistence
		   --strQAStatus
		   ,idet.QualityStatus
		FROM Inventory inv 
		 inner join InventoryDetails idet on idet.InventoryId = inv.Id
		 where inv.id = @intInvId 
		 --and idet.PickingPiecesExistence > 0
		 --AND idet.
	---
	
      -- cprod
	  
	  UPDATE #tempInv
	  SET 	 intProduct  = cprod.ProductId
	         --,intCustomerId = cprod.CustomerId
	  FROM #tempInv tbc
	  inner join CustomerProducts cprod on cprod.Id = tbc.intCustomerProduct 
	  
	  WHERE cprod.Id = tbc.intCustomerProduct 
	  
	 
      -- productos 
	  
	  UPDATE #tempInv
	  SET 	  strSKU  = pro.Name	  
	         ,intprouomid   = pro.ShippingUom 			 
			 ,strprodName = pro.Name			 			 
			 ,strSKUEndCustomer  =pro.Name 
	         
	  FROM #tempInv tbc	  
	  INNER JOIN Products pro on pro.Id =  tbc.intProduct  
	  WHERE pro.Id =  tbc.intProduct  
	  
	 
	 --- BORRAR LOS IDS QUE NO CORRESPONDAN AL SKU
	 DELETE #tempInv
	 FROM #tempInv
	 WHERE #tempInv.strSKU  <> @strSKU
	 -------
	 --select * from #tempInv

	  --strStatus 

	  
	  UPDATE #tempInv
	  SET strStatus = st.Status
	  FROM #tempInv tbc	  	
	   inner join StatusTypes st on st.Id = tbc.intStatus 
	  WHERE tbc.intStatus >0
	  
	  

	  ---

	  UPDATE #tempInv
	  SET 	  strSKU  = pro.Name	  
	         ,intprouomid   = pro.ShippingUom 			 
			 ,strprodName = pro.Name			 			 
	         
	  FROM #tempInv tbc	  
	  INNER JOIN Products pro on pro.Id =  tbc.intProduct  
	  WHERE pro.Id =  tbc.intProduct  
	  
	 

	 --- worktable 
	  CREATE TABLE #tempInvWork(	
	               ID int IDENTITY(1,1) PRIMARY KEY				   				   
				   ,intIndet int null
				   ,intWorOrderIdF INT NULL
				   ,intWorOrderIdDet INT NULL
				   ,dtmAlloc DATETIME NULL
				   ,strType varchar(20) NULL
				   ,intCQFolio INT NULL
				   ,strCQFolio  VARCHAR(20) NULL
				   ,intCustFolio INT NULL
				   ,strCustFolio VARCHAR(20) NULL
				   ,intQtyReq INT NULL
				   ,intReqStatus INT NULL
				   ,strReqStatus VARCHAR(20) NULL
				   ,intReqId INT NULL
				   ,intReqDet INT NULL
		 
				   )
		
	 --- wo
	 INSERT INTO #tempInvWork(		             
				   intIndet ,intWorOrderIdF , strType 
				   ,intCustFolio ,strCQFolio
				   ,intReqStatus   
				   )
	 ---
	 SELECT --intIndet ,intWorOrderIdF ,strWorkType 
	         tbc.intIndet , req.Id ,'REQ'

			 --   ,intCustFolio ,intCQFolio 			 
			 , req.FOLIO ,req.REQFolio
			 --intReqStatus  ,intWorOrderIdF 
			 ,req.ReqStatus  	 
			 ---
			 
	 FROM #tempInv tbc
	 INNER JOIN Requirements req on req.Id = tbc.SalvageWorkOrderReqId	 
	 WHERE tbc.SalvageWorkOrderReqId >0
	 -----------

	 UPDATE #tempInvWork
	 SET 
		 intQtyReq = rdet.Quantity
				  -- ,strCustomFolio varchar(100) NULL
				  
		 ,intWorOrderIdF = tbc.intWorOrderIdF 
		 ,intWorOrderIdDet =  rdet.Id
	 FROM #tempInvWork tbc
	  INNER JOIN RequirementDetails rdet on rdet.RequirementId = tbc.intWorOrderIdF
	 WHERE tbc.intWorOrderIdF>0
	  
	 --  marcar los masters que tengan trabajo
	 UPDATE #tempInv
	 SET inthaswork  = tbc.intWorOrderIdF
	 FROM #tempInv m
	 INNER JOIN #tempInvWork tbc on tbc.intIndet = m.intIndet 
	 WHERE isnull(m.inthaswork,0) > 0
	 and isnull(tbc.intWorOrderIdF,0)>0

	 ---SHP
	 
	 ---
	  --
	  
	  declare @lint_ship int 
	  declare @lint_shipDT int 
	  declare @lint_ident int 

	  declare @ldtmAlloc datetime
	  declare @lintReqId int

	  set @lint_ship  = 0 
	  set @lint_shipDT  = 0 

	  --select * from #tempInv 
	  
	  declare lcr_shipdat CURSOR FOR
	  SELECT TB.intIndet
	  FROM #tempInv TB
	  WHERE TB.intIndet >0
	  AND isnull(TB.inthaswork,0) = 0
	 


	  OPEN lcr_shipdat 
	  FETCH NEXT FROM lcr_shipdat INTO @lint_ident 

	  WHILE @@FETCH_STATUS =0
	  BEGIN
	        SET @lint_ship   =NULL
			SET @lint_shipDT = NULL
			SET @ldtmAlloc = NULL
			SET @lintReqId = NULL
	

	        SELECT @lint_shipDT= sh.Id
			       ,@lint_ship  = sh.ShipmentId
	
			FROM ShipmentDetails sh
			WHERE sh.InventoryDetailId = @lint_ident 


			 SET @lint_ship   = ISNULL(@lint_ship  ,0)
			 SET @lint_shipDT = ISNULL(@lint_shipDT,0)

			 IF ( @lint_ship   >0  and @lint_shipDT >0 )
			 BEGIN
			 		INSERT INTO #tempInvWork
					(intIndet,intWorOrderIdDet  , intWorOrderIdF,strType 					
					)
					
					SELECT 
					--(intIndet,intWorOrderIdDet  , intWorOrderIdF,strType 
					 @lint_ident , @lint_shipDT, @lint_ship    , 'SHIP'	 
					 
			 END --
			 	

			FETCH NEXT FROM lcr_shipdat INTO @lint_ident 
	  END -- CURSOR
	  CLOSE lcr_shipdat 
	  DEALLOCATE lcr_shipdat 

	  -- actualizar work
	  UPDATE #tempInv
	 SET inthaswork  = tbc.intWorOrderIdF
	 FROM #tempInv m
	 INNER JOIN #tempInvWork tbc on tbc.intIndet = m.intIndet 
	 WHERE isnull(m.inthaswork,0) > 0
	 and isnull(tbc.intWorOrderIdF,0)>0
--	 ---

     
	 --------
	 -- borrar los que tengan work
	 delete #tempInv
	 from #tempInv m
	 WHERE isnull(m.inthaswork,0) > 0

	 ---------
	 ---strQAStatus	 
	  UPDATE #tempInv
	  SET strQAStatus = st.Status
	  FROM #tempInv tbc	  	
	   inner join StatusTypes st on st.Id = tbc.intQualityStatus
	  WHERE tbc.intQualityStatus>0

	 --intCustomerId
	 --			   ,intQualityStatus 
	 --strQAStatus 
	 --intStatus 
	 --strStatus 
	 --------------------
	 -------------------------
	 --intSupplierId
	 --strSupplierName 
	 --intQty
	 --dtmQADate 
	 UPDATE #tempInv
	 SET dtmQADate= (SELECT MAX(QA.TransferedDate)
	      FROM InvDetailQAChanges QA
		  WHERE QA.InventoryId = M.intInvId
		  )
	 FROM #tempInv M	  
	 WHERE M.intInvId>0 


	 --CLEAN
	 UPDATE #tempInvWork 
	  set strCQFolio  = isnull(strCQFolio  ,'')
	    ,intCQFolio = ISNULL(intCQFolio,0)
		,intCustFolio = ISNULL(intCustFolio,0)
		,intQtyReq = ISNULL(intQtyReq,0)
		,strReqStatus   = ISNULL(strReqStatus ,'')
		
	 FROM #tempInvWork  dt
	 where dt.intIndet >0

	 UPDATE #tempInv
	 SET strQAStatus  = ISNULL(strQAStatus,'')
	    ,intQty=ISNULL(intQty,0)
	 FROM #tempInv
	 ---


	 ---------------
	    
     SELECT
	  M.strSKUEndCustomer as 'strSKUEndCustomer'
	 , M.strSupplierName as 'strSupplierName'
	 , M.strQAStatus as 'strQAStatus'
	 ,M.dtmQADate as 'dtmQADate'
	 ,SUM(M.intQty) As 'intQty' 
	   
	 FROM #tempInv M
	 
	 GROUP BY  M.strSKUEndCustomer
	 , M.strSupplierName
	 , M.strQAStatus
	 ,M.dtmQADate
	 
	 DROP TABLE #tempInv 
	 DROP TABLE #tempInvWork
	 
	 END -- BEGIN
	 --RETURN 0 
			 