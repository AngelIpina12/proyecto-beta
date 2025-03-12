USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_GetSummaryYardMng]    Script Date: 10/06/2024 04:56:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--CREATE PROCEDURE [dbo].[USP_GetSummaryYardMng]
ALTER PROCEDURE [dbo].[USP_GetSummaryYardMng]

(@UserId INT
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
  -- 	DECLARE @aint_UserId int
	DECLARE @lint_WhareHouseId int
	DECLARE @ldtm_StartRange DATETIME
	DECLARE @ldtm_EndRange DATETIME

	DECLARE @llng_TotalTrailersYard numeric(16)
	DECLARE @llng_TotalTrailersEmptyIn numeric(16)
	DECLARE @llng_TotalTrailersEmptyOut numeric(16)
	DECLARE @llng_TotalTrailersUnloadingP numeric(16)
	DECLARE @llng_TotalTrailersYardLoadIn numeric(16)
	DECLARE @llng_TotalTrailersYardLoadOut numeric(16)
	DECLARE @llng_TotalTrailersLoadingP numeric(16)

	--- otros de usuarios 
	DECLARE  @partyRoleId INT, @ExternalId INT	
	DECLARE  @isAllWareHouses INT
	DECLARE  @isAdmin INT
	DECLARE  @strCustomerName varchar(100)
	DECLARE  @strPartyRoleName varchar(100)
	DECLARE  @intRoleId INT
	DECLARE  @strWhareHousename varchar(100)
	DECLARE  @intWareCustomerId INT

	--- otros de usuarios 

	--SET @aint_UserId = 3025
	SET @lint_WhareHouseId =0
	SET @partyRoleId =NULL
	SET @ExternalId  =0
	SET @isAdmin =0
	SET @intWareCustomerId = NULL
	-------
	-- infor usuario	
	SELECT  @partyRoleId= Security.Users.PartyRoleId
	       ,@ExternalId  =Security.Users.ExternalTypeId
	       ,@lint_WhareHouseId =Security.Users.WarehouseId
		   ,@isAllWareHouses = Security.Users.AllWarehouses
		   
	FROM Security.Users 	 	
	WHERE Security.Users.Id = @UserId
	--WHERE Security.Users.Id = @aint_UserId
	
	SELECT @intRoleId  =MAX (Security.UserRoles.RoleId)
	FROM Security.UserRoles 
	WHERE  Security.UserRoles.UserId = @UserId
	--WHERE Security.UserRoles.UserId  = @aint_UserId

	--obtener los nombres del rol
	SELECT @strPartyRoleName = Security.Roles.RoleName
	FROM Security.Roles
	WHERE Security.Roles.Id = @intRoleId  

	--- SI ES admins obtener marcarlo
	
	 IF (@strPartyRoleName ='Admins')
	  BEGIN
	   SET @isAdmin =1
	  END 

	  --- obtener cliente
	 SELECT @strCustomerName = Customers.Name
	  ---obtener cliente de almacen
	      , @intWareCustomerId  = Customers.WarehouseCustomerId
	 FROM Customers
	 WHERE Customers.Id =  @partyRoleId
	 -------
	 
	 
	 -- nombre del almacen	 
	  SELECT @strWhareHousename = Warehouses.Warehouse
	  FROM Warehouses
	  WHERE Warehouses.Id=@lint_WhareHouseId 

	 -- SI SON TODOS 

	 IF ( ( @isAllWareHouses  = 1 ) OR (@isAdmin =1) )
	 BEGIN
	  --NOMBRA ALL
	  SET  @strCustomerName ='Admin'
	  set @lint_WhareHouseId  =0
	  set @isAdmin  =1 

	 END 
	 
	 ---
	 ----

	 --ID =0

	
	--------

	-- si alguna de las fechas es nula	
	IF (  (@ldtm_StartRange is NULL)  or (@ldtm_EndRange is NULL) )
	BEGIN
		SELECT  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		SELECT  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )

		-- SELECT @ldtm_StartRange  ,@ldtm_EndRange 
	END --IF (  (@ldtm_StartRange is NULL)  or (@ldtm_EndRange is NULL) )

	CREATE TABLE #tempTrailers(
	               Id INT PRIMARY KEY,
				   IntRecepStatus INT NULL,
				   strRececpStatus varchar(50) NULL,
				   IntCurrentStatus INT NULL,
				   strCurrentStatus varchar(50) NULL,		
				   IntOrgGPStatusIn INT NULL,
				   strOrgGPStatusIn VARCHAR(50) NULL,
				   IntOrgGPStatusOut  INT NULL,
				   strOrgGPStatusOut VARCHAR(50) NULL,
				   CustomerId int NULL,
				   WareHouseId int NULL
	            )
				
	INSERT INTO #tempTrailers(Id
	                          ,IntRecepStatus ,strRececpStatus 
							  ,IntCurrentStatus ,strCurrentStatus 	
							  ,IntOrgGPStatusIn, strOrgGPStatusIn
							  ,IntOrgGPStatusOut,strOrgGPStatusOut
	                         ,CustomerId ,WareHouseId  )
	SELECT  RecTrailers.Id
	      , RecepStat.Id , RecepStat.Status  
	      , CurrentStat.Id , CurrentStat.Status	
		  , StatGpin.Id , StatGpin.Status
		  ,StatGpout.Id ,StatGpout.Status
		  
	      , RecTrailers.SingleCustomerId  , RecTrailers.WarehouseId 
	FROM RecTrailers
	 LEFT JOIN  StatusTypes CurrentStat ON  CurrentStat.Id =RecTrailers.RecTrStatus
	 LEFT JOIN  StatusTypes RecepStat  on   RecepStat.Id =  RecTrailers.TrStatus
	 LEFT JOIN  StatusTypes StatGpin  on   StatGpin.Id = CONVERT(int, RecTrailers.OrgGPStatusIn)
	 LEFT JOIN  StatusTypes StatGpout  on  StatGpout.Id = CONVERT(int, RecTrailers.OrgGPStatusOut)

    WHERE RecTrailers.ReceivingStart between  @ldtm_StartRange   and @ldtm_EndRange 
	--CUSTOMER
	AND RecTrailers.SingleCustomerId = ISNULL(@partyRoleId,RecTrailers.SingleCustomerId )
	-- WAREHOUSECUSTOMER
	 AND RecTrailers.WarehouseCustomerId  = ISNULL(@intWareCustomerId ,RecTrailers.WarehouseCustomerId)
	-- WAREHOUSE

	AND ( ( RecTrailers.WarehouseId = @lint_WhareHouseId )
	     or
		  ( @isAdmin  =1 )
		)
	
	AND NOT ( 
	            RecepStat.Status LIKE '%canc%'
				OR
				RecepStat.Status LIKE '%rej%'
	        )


	-- CONTAR LOS TOTALES 
	   SELECT @llng_TotalTrailersYard = COUNT(*)
	   FROM #tempTrailers

	-- contar los yard empty in
	   SELECT @llng_TotalTrailersEmptyIn = COUNT(*)
	   FROM #tempTrailers
	   WHERE #tempTrailers.strRececpStatus ='Empty In'
	   OR #tempTrailers.strOrgGPStatusIn='Empty In'

	-- contar los yard empty out
	 SELECT @llng_TotalTrailersEmptyOut = COUNT(*)
	   FROM #tempTrailers
	   WHERE #tempTrailers.strCurrentStatus ='Empty Out'

	-- contar los unloading process
	 SELECT @llng_TotalTrailersUnloadingP = COUNT(*)
	 FROM #tempTrailers
	 WHERE #tempTrailers.strCurrentStatus in (
	           -- 'Pending Unload' ,
				--'Unload Setup' ,
				'Unload Started'
				--,'Unloading'	
				,'Preparing Unload'
				,'Unload Completed'
				)
	
	-- contar los yard loaded in 
	 -- los ingresados cargados tambien son close 
	 SELECT @llng_TotalTrailersYardLoadIn  = COUNT(*)
	 FROM #tempTrailers 
	 WHERE ( #tempTrailers.strRececpStatus in ('Loaded In','Close Trailer')
	       ) 
		   or  -- 492 or ing 498 () ingresados
		    (
			  #tempTrailers.strRececpStatus  = 'Received At Dock'
			  and 
			  #tempTrailers.strOrgGPStatusIn = 'Loaded In'
			)
		   
	
	-- contar los yar loaded out
	 SELECT @llng_TotalTrailersYardLoadOut = COUNT(*)
	 FROM #tempTrailers
	 WHERE #tempTrailers.strCurrentStatus in ('Loaded Out')
	
	-- contar los loading process
	SELECT @llng_TotalTrailersLoadingP = COUNT(*)
	 FROM #tempTrailers
	 WHERE #tempTrailers.strCurrentStatus in ('Loading In Process')	
	
	
	SELECT @llng_TotalTrailersYard  AS 'TotalTrailersYard'
	      , @llng_TotalTrailersEmptyIn  AS 'TotalTrailersEmptyIn'
		  , @llng_TotalTrailersEmptyOut AS 'TotalTrailersEmptyOut'
		  , @llng_TotalTrailersUnloadingP AS 'TotalTrailersUnloadingP'
		  , @llng_TotalTrailersYardLoadIn AS 'TotalTrailersYardLoadIn'
		  , @llng_TotalTrailersYardLoadOut AS 'TotalTrailersYardLoadOut'
		  , @llng_TotalTrailersLoadingP AS 'TotalTrailersLoadingP'
		  , @strCustomerName AS 'Customer'
		  , @strWhareHousename AS 'WareHouse'
		  , @isAdmin  as 'isAdmin'
		  ,@strPartyRoleName as 'PartyRoleName'
		  ,@UserId as 'UserId'
	DROP TABLE  #tempTrailers

END

