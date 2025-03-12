USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetToday]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetToday]
--  ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetToday]

(@UserId INT
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
	DECLARE  @strUserId varchar(100)

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
		   ,@strUserId  = us.UserId
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
	 -------
	      SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )

	 -------------
	 IF ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )
	 BEGIN
	 	       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-07-20 00:00' ) 
			   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-07-20 23:59'  ) 	     
	 END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )


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
	
			 --insertar tabla de resultados 
		INSERT INTO #tempReceivingList(strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate )

	-------------------

			 SELECT 
			 		--strReceinvingFolio ,strTrailerFolio ,DtmReceivedDate 
					rts.RECFolio , rec.TRFolio , rec.ReceivingStart

				 FROM RecTrailers rec
				 INNER JOIN RectrailerShipments rts on rts.RecTrailerId= rec.Id
				 
				 
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
			   	  AND rec.ReceivingStart between  ISNULL(@ldtm_StartRange ,rec.ReceivingStart )and ISNULL(@ldtm_EndRange ,rec.ReceivingStart )

			Order by rec.Id ASC
				

					 SELECT DtmReceivedDate as 'dtmReceivedDate'
					        ,strReceinvingFolio as 'strReceinvingFolio'
							,strTrailerFolio as 'strTrailerFolio'
					 FROM #tempReceivingList
					 GROUP BY DtmReceivedDate ,strReceinvingFolio,strTrailerFolio

					 RETURN 0

	 
	 END -- BEGIN
	 --RETURN 0 
			