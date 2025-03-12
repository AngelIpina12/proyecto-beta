USE [cargoquin]
--USE [WMSDEV]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_INVSKUOnHand]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Francisco Javier Cadena Hernández
-- Create date: 19-11-2024
-- Description:	Consulta de inventario skus que tienen status onhand
-- =============================================

--CREATE PROCEDURE [dbo].[USP_CustomerPortal_INVSKUOnHand]
ALTER PROCEDURE [dbo].[USP_CustomerPortal_INVSKUOnHand]

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
				   
				   --
				   ,dtmreceive datetime null
				   ,intTotalPieces INT NULL
				   ,strSupplierName VARCHAR(50) NULL
				   ,intSupplierId INT NULL
				   ,strShipUOMInv VARCHAR(50) NULL
				   ,strShipUOMName VARCHAR(50) NULL
				   ,intPallets INT NULL
				   ,intBoxesxPallets INT NULL
				   ,intPiecesxBox int
				   ---
				   ,intProduct   INT NULL
				   ,strSKU VARCHAR(50) NULL
				   )
	  --- worktable 
	 
		--- obtener los ids detalles 
		INSERT INTO #tempInv(		               
				   intInvId ,intIndet ,intCustomerProduct 
				   ,intTotalPieces ,strSupplierName,intSupplierId
				   ,strShipUOMInv ,strShipUOMName ,intPallets
				   ,intBoxesxPallets ,intPiecesxBox
				   ,dtmreceive
				   )
		SELECT 
		  --intInvId ,intIndet ,intCustomerProduct 		  
		   inv.Id, idet.Id , idet.CustomerProductId
		  -- ,intTotalPieces ,strSupplierName,intSupplierId
		  ,idet.TotalPieces , idet.SupplierName ,idet.SupplierId
		  --   ,strShipUOMInv ,strShipUOMName ,intPallets
		  , idet.ShippingUom , '' , idet.Pallets
		  --   ,intBoxesxPallets ,intPiecesxBox
		 ,idet.BoxesExistence*idet.Pallets , idet.BoxesExistence*idet.PiecesExistence		  
		 --dtmreceive
		 --, inv.EntryDate
		-- , cast( cast( inv.EntryDate  as varchar(25) )+ ' '+cast( inv.EntryTime  as varchar(25) )   as  datetime ) ----CAST(req.CurrentDate AS DATETIME) + CAST(req.CurrentTime AS TIME) -- req.CurrentDate 			  
		, convert(datetime, inv.EntryDate   ,103) + CAST(inv.EntryTime  as DATETIME)
			  
    FROM Inventory inv 
		 inner join InventoryDetails idet on idet.InventoryId = inv.Id
		 where inv.id = @intInvId 
		 and idet.TotalPieces >0
	---
	
      -- cprod
	  
	  UPDATE #tempInv
	  SET 	 intProduct  = cprod.ProductId
	  FROM #tempInv tbc
	  inner join CustomerProducts cprod on cprod.Id = tbc.intCustomerProduct 
	  
	  WHERE cprod.Id = tbc.intCustomerProduct 
	  
	 
      -- productos 
	  
	  UPDATE #tempInv
	  SET 	  strSKU  = pro.Name	  
	         ,strShipUOMName = pro.ShippingUom 
			 
	  FROM #tempInv tbc	  
	  INNER JOIN Products pro on pro.Id =  tbc.intProduct  
	  WHERE pro.Id =  tbc.intProduct  
	  
	 
	 --- BORRAR LOS IDS QUE NO CORRESPONDAN AL SKU
	 DELETE #tempInv
	 FROM #tempInv
	 WHERE #tempInv.strSKU  <> @strSKU
	 -------
	 
	 ---------------
	    
     SELECT M.dtmreceive as 'dtmreceive'
	      ,M.strSupplierName  as 'strSupplierName'
		  ,M.intTotalPieces  as 'intQty'
		  ,M.strShipUOMInv  as 'strShipUOMInv'
		  ,M.intPallets as 'intPallets'
		  ,M.intBoxesxPallets as 'intBoxesxPallets'
		  ,M.intPiecesxBox as 'intPiecesxBox'
		  
	 FROM #tempInv M
	 GROUP BY 	 M.dtmreceive 
	      ,M.strSupplierName  
		  ,M.intTotalPieces  
		  ,M.strShipUOMInv 
		  ,M.intPallets 
		  ,M.intBoxesxPallets 
		  ,M.intPiecesxBox 

	 
	 
	 DROP TABLE #tempInv 
	 
	 END -- BEGIN
	 --RETURN 0 
			 