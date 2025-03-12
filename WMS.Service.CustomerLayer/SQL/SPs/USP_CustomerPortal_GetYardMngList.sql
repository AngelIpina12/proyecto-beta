USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetYardMngList]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER  PROCEDURE [dbo].[USP_CustomerPortal_GetYardMngList]
   

(@UserId INT
 ,@intIsToday INT = NULL
 ,@intIsTrailerFolio INT = NULL
 ,@strTrailerFolio varchar(50)
 ,@intIsRangeDate INT = NULL
 ,@dtmStartDate datetime = NULL
 ,@dtmEndDate   datetime =NULL
 ,@intIsTrailerNumber INT = NULL
 ,@strTrailerNumber VARCHAR(50) NULL
 ,@intStatusId INT = NULL
 ,@strStatusVal VARCHAR(50)
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

		  --- obtener cliente
	 SELECT @strCustomerName = Customers.Name
	  ---obtener cliente de almacen
	      , @intWareCustomerId  = Customers.WarehouseCustomerId
	 FROM Customers
	 WHERE Customers.Id =  @partyRoleId

	--- SI ES admins obtener marcarlo
	
	 IF (@strPartyRoleName ='Admins')
	  BEGIN
	   SET @isAdmin =1
	  END 
	----
	--jcadena 2025,. si eS ALOPEZ ponerlo admin
	IF (@UserId = 3025 )
	BEGIN
	SET @isAdmin =1
	END 

	  
	--
	-- inicializar banderas 
	 SET @lintfilterapllied=0
	 set @lintDatefilterToCheck =0
	 ----------
     IF(@strTrailerFolio ='')
	 BEGIN
	   SET @strTrailerFolio  = NULL
	 END 

	 IF (@strTrailerNumber = '')
	 BEGIN
	   SET @strTrailerNumber  = NULL
	 END 
	 
	 IF (@strStatusVal  = '')
	 BEGIN
	   SET @strStatusVal   = NULL
	 END 
  
   if (@intStatusId =0)
    BEGIN
	   SET @intStatusId = NULL
	 END 
  
	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempTrailerList(
	               Id INT PRIMARY KEY
				   ,DtmRegistrationDate DATETIME NULL
				   ,DtmReceivedDate DATETIME NULL
				   ,strTrailerFolio VARCHAR(50) NULL
				   ,strTrailerNumber VARCHAR(50) NULL
				   ,strSeal VARCHAR(50) NULL
				   ,strCarrierLine VARCHAR(150) NULL
				   ,strDriverName VARCHAR(150) NULL
				   ,strStatus VARCHAR(50) NULL
				   ,intCustomerId int NULL
				   ,intWareHouseId int NULL
	            )
				
   -- crear tabla de status ingreso 
    CREATE TABLE #tempStatusCurrent
	( strName varchar(50) NULL
	)

	---crear tabla de recepstatus 
	CREATE TABLE #tempStatusRecept
	( strName varchar(50) NULL
	)

	-- crear tabla de orgstatusin
	CREATE TABLE #tempOrgStatusIn
	( strName varchar(50) NULL
	)


	
	--definir rango 
	IF(@intIsToday =1)
	BEGIN
	   		SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
			SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
			SET @strTrailerFolio = NULL
			SET @strTrailerNumber  = NULL
			SET @intStatusId = NULL
			--SET @strStatusVal =NULL
			SET @lintfilterapllied =1 -- filtro general aplicado
			SET  @lintDatefilterToCheck  = 1 --filtro de fecha aplicado

			 -- validar si hay estatus 

			 			 ----
			 	----
			
			   -- revisar status textual 
			   IF ( LEN (@strStatusVal)>1 )
			   BEGIN
				   SET @intStatusId  = NULL
	   
	    
				  IF (	@strStatusVal ='Yard Empty In')
				  BEGIN
				   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Empty In')


				   INSERT INTO #tempStatusRecept( strName )
				   VALUES ('Empty In')

				   
				   INSERT INTO #tempOrgStatusIn( strName )
				   VALUES ('Empty In')

				        INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Received At Dock')
	                
				
				 
				  END --"Yard Empty In"

				  IF (	@strStatusVal ='Yard Empty OUT')
				  BEGIN

				   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Empty Out')

				 

				  END --"Yard Empty OUT"

	  
				  IF (	@strStatusVal ='Unloading Process')
				  BEGIN
	   
				   --INSERT INTO #tempStatusCurrent( strName )
				   --VALUES ('Unloaded')

				   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Preparing Unload')

				   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Unload Started')

				   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Unloading')

				   	   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Unload Completed')

				   


				  END --"Unloading Process


				  IF (	@strStatusVal ='Yard Loaded IN')
				  BEGIN

					INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Loaded In')

				      INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Received At Dock')

				   INSERT INTO #tempStatusRecept( strName )
				   VALUES ('Close Trailer')
				   
				   INSERT INTO #tempOrgStatusIn( strName )
				   VALUES ('Loaded In')

				  END --"Yard Loaded IN


	  
				  IF (	@strStatusVal ='Yard Loaded OUT')
				  BEGIN
	   
					INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Loaded Out')

				 
				  END --"Yard Loaded OUT

	  
				  IF (	@strStatusVal ='Loading Process')
				  BEGIN
					INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Loading In Process')

				   INSERT INTO #tempStatusCurrent( strName )
				   VALUES ('Ready To Load')


				  END --Loading Process

			   END ---IF( ( LEN (@strStatusVal)>1 ) 
   
			-----
			 ----

	END --IF(@intIsToday =1)


	--
	IF ( (@intIsTrailerFolio =1) AND (@lintfilterapllied=0) )
	BEGIN
	      --  SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  --  SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
		  --  SET  @ldtm_StartRange   = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  --  SET  @ldtm_StartRange   =DATEADD(YY, -1, @ldtm_StartRange   )		
		   -- SET  @ldtm_StartRange   = NULL
		  -- SET   @ldtm_EndRange = NULL
		  -- si la fecha no es nula usar las fechas 
		  IF ( ( @dtmStartDate > @ldtm_ValidDate) AND ( @dtmEndDate > @ldtm_ValidDate) )
			  BEGIN
			   SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate  ) )
				SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @dtmEndDate   )  )
			  END
		  ELSE 
		   BEGIN
		     SET  @ldtm_StartRange   = NULL
		    SET   @ldtm_EndRange = NULL
		   END 

			SET @strTrailerNumber  = NULL
			SET @intStatusId = NULL
			--SET @strStatusVal =NULL
			--@strTrailerFolio 
			SET @lintfilterapllied =1 -- filtro general aplicado

		

	END  --IF ( (@intIsTrailerFolio =1) AND (@lintfilterapllied=0) )
	
	
	 
   IF ( (@intIsTrailerNumber=1) AND (@lintfilterapllied=0) )
   BEGIN
            --SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
			--SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
			--SET  @ldtm_StartRange   = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
			--SET  @ldtm_StartRange   =DATEADD(YY, -1, @ldtm_StartRange   )			
			--SET @strTrailerNumber  = NULL

			-- ver si incluir fecha 
			IF ( ( @dtmStartDate > @ldtm_ValidDate) AND ( @dtmEndDate > @ldtm_ValidDate) )
			  BEGIN
			   SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate  ) )
				SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @dtmEndDate   )  )
			  END
		  ELSE 
		   BEGIN
		     SET  @ldtm_StartRange   = NULL
		    SET   @ldtm_EndRange = NULL
		   END 

			----------
			SET @intStatusId = NULL
			SET @strStatusVal =NULL
			SET @strTrailerFolio = NULL
			SET @lintfilterapllied =1 -- filtro general aplicado
			 
			 --select @dtmStartDate  , @dtmEndDate   ,@ldtm_StartRange ,@ldtm_EndRange ,@strTrailerFolio ,@strTrailerNumber ,@intIsTrailerNumber,@lintfilterapllied 
			 --print 'trailer numb'

   END --( (@intIsTrailerNumber=1) AND (@lintfilterapllied=0) )
   
   
   -- revisar status textual 
   IF( ( LEN (@strStatusVal)>1 ) AND (@lintfilterapllied=0) )
   BEGIN
	   SET @intStatusId  = NULL
	   
	    
	  IF (	@strStatusVal ='Yard Empty In')
	  BEGIN
	   INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Empty In')

	  INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Received At Dock')
	
	   SET @lintfilterapllied =1 
	  END --"Yard Empty In"

	  IF (	@strStatusVal ='Yard Empty OUT')
	  BEGIN

	   INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Empty Out')

	   SET @lintfilterapllied =1 

	  END --"Yard Empty OUT"

	  
	  IF (	@strStatusVal ='Unloading Process')
	  BEGIN
	   
	   --INSERT INTO #tempStatusCurrent( strName )
	   --VALUES ('Unloaded')

	   INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Preparing Unload')

	   INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Unload Started')

	   INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Unloading')

	   SET @lintfilterapllied =1 

	  END --"Unloading Process


	  IF (	@strStatusVal ='Yard Loaded IN')
	  BEGIN

	    INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Loaded In')

	   	  INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Received At Dock')
	

	   SET @lintfilterapllied =1 

	  END --"Yard Loaded IN

	  
	  IF (	@strStatusVal ='Yard Loaded OUT')
	  BEGIN
	   
	    INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Loaded Out')

	   SET @lintfilterapllied =1 
	  END --"Yard Loaded OUT

	  
	  IF (	@strStatusVal ='Loading Process')
	  BEGIN
	    INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Loading In Process')

	   INSERT INTO #tempStatusCurrent( strName )
	   VALUES ('Ready To Load')

	   SET @lintfilterapllied =1 

	  END --Loading Process

		------- ver si incluirfecha 
					IF ( ( @dtmStartDate > @ldtm_ValidDate) AND ( @dtmEndDate > @ldtm_ValidDate) )
					  BEGIN
					   SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate  ) )
						SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @dtmEndDate   )  )
					  END
				  ELSE 
				   BEGIN
					 SET  @ldtm_StartRange   = NULL
					SET   @ldtm_EndRange = NULL
				   END 
 
   END ---IF( ( LEN (@strStatusVal)>1 ) AND (@lintfilterapllied=0) )
   -------------------------------
   
   -- si no se ha aplicado filtro textual, aplicar filtro numerico 
   IF ( (@intStatusId  >0 ) AND (@lintfilterapllied=0) )
   BEGIN
          --  SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
		  ---SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )
		 --	SET  @ldtm_StartRange   = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
	     --	SET  @ldtm_StartRange   =DATEADD(YY, -1, @ldtm_StartRange   )			
		--	SET @strTrailerNumber  = NULL
			--SET @intStatusId = NULL
			------- ver si incluirfecha 
			IF ( ( @dtmStartDate > @ldtm_ValidDate) AND ( @dtmEndDate > @ldtm_ValidDate) )
			  BEGIN
			   SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate  ) )
				SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @dtmEndDate   )  )
			  END
		  ELSE 
		   BEGIN
		     SET  @ldtm_StartRange   = NULL
		    SET   @ldtm_EndRange = NULL
		   END 

			------------

			-- SI ES MAYOR A 0
			 IF ( @intStatusId  >1 )
			 BEGIN
			      -- obtener el identificador
				  SELECT @strStatusVal = StatusTypes.Status
				  FROM StatusTypes
				  WHERE Id = @intStatusId

				   SET @lintfilterapllied =1
			 END  --IF ( @intStatusId  >1 )

			 IF ( ( LEN( @strStatusVal)>2  )  AND  (@lintfilterapllied =0) )
			 BEGIN
			      SELECT  @intStatusId = StatusTypes.Id
				  FROM StatusTypes
				  WHERE  StatusTypes.Status =  @strStatusVal 

				  SET @lintfilterapllied =1 -- filtro general aplicado
			 END  --( ( LEN( @strStatusVal)>2  )  AND  (@lintfilterapllied =0) )

			SET @strTrailerFolio = NULL			

   END  --( (@intStatusId  >0 ) AND (@lintfilterapllied=0) )
 

	--
	IF ( (@intIsRangeDate  =1) AND (@lintfilterapllied=0) )
	BEGIN
	        SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate  ) )
			SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @dtmEndDate   )  )

			
			SET @strTrailerNumber  = NULL
			SET @intStatusId = NULL
			SET @strStatusVal =NULL
			SET @strTrailerFolio = NULL
			SET @lintfilterapllied =1 -- filtro general aplicado
			SET  @lintDatefilterToCheck  = 1 --filtro de fecha aplicado

	END --IF ( (@intIsTrailerFolio =1) AND (@lintfilterapllied=0) )


	-----------
	
	--select @intIsRangeDate  as '@intIsRangeDate  '
	--   ,@lintfilterapllied as '@lintfilterapllied'
	--   ,@ldtm_StartRange   as '@ldtm_StartRange  '
	--   ,@ldtm_EndRange  as '@ldtm_EndRange '
	--   ,@strTrailerNumber  as '@strTrailerNumber  '
	--   ,@intStatusId as '@intStatusId '
	--   ,@strStatusVal as '@strStatusVal '
	--   ,@strTrailerFolio as '@strTrailerFolio '
	--   ,@lintfilterapllied as '@lintfilterapllied '
	 --  ,@lintDatefilterToCheck  as '@lintDatefilterToCheck  '
	--   ,@strStatusVal as '@strStatusVal '
	--  ,   @lint_WhareHouseId  as '   @lint_WhareHouseId '
	--  ,@intWareCustomerId as '@intWareCustomerId '
	--  ,@partyRoleId as '@partyRoleId '
	  
	 -- select * from  #tempOrgStatusIn
	 -- select * from  #tempStatusRecept
	 --- select * from    #tempStatusCurrent
	    

	----------------

	-- si se aplico filtro
	 IF ( @lintfilterapllied =1)
	 BEGIN

	  --para admins
	   IF (@isAdmin =1)
	   BEGIN
			SET @intWareCustomerId = NULL
			SET  @partyRoleId  = NULL
			SET @intWareCustomerId  = NULL
	 	END 


	 -------
	 --SELECT @partyRoleId AS '@partyRoleId'
	 -- , @intWareCustomerId  AS '@intWareCustomerId'
	 -- ,@isAdmin   AS '@isAdmin  '
	 -- ,@lintfilterapllied  AS '@lintfilterapllied '
	 -- ,@ldtm_StartRange  AS '@ldtm_StartRange '
	 -- ,@ldtm_EndRange  AS '@ldtm_EndRange '
	 -- ,@strStatusVal  AS '@strStatusVal '
	 -- ,@strTrailerFolio  AS '@strTrailerFolio '
	 -- ,@strTrailerNumber  AS '@strTrailerNumber '
	 -- ,@intStatusId  AS '@intStatusId '
				  
	 -----------
			 --insertar tabla de resultados 
		INSERT INTO #tempTrailerList(
										 Id ,DtmRegistrationDate ,DtmReceivedDate ,strTrailerFolio 
										 ,strTrailerNumber ,strSeal ,strCarrierLine ,strDriverName 
										 ,strStatus ,intCustomerId ,intWareHouseId 
										)
			SELECT  
						--Id ,DtmRegistrationDate ,DtmReceivedDate ,strTrailerFolio 
						RecTrailers.Id , RecTrailers.RegistrationDateTime, RecTrailers.ReceivingStart ,RecTrailers.TRFolio
						--,strTrailerNumber ,strSeal ,strCarrierLine 
						,RecTrailers.Trailer ,RecTrailers.Seal , tl.Name  
						--,strDriverName 
						, Drivers.FirstName  + ' ' + Drivers.LastName 
						--,strStatus ,intCustomerId ,intWareHouseId 
						,CurrentStat.Status  , @intWareCustomerId  , @lint_WhareHouseId 
			
				FROM RecTrailers
					LEFT JOIN   TransportationLines tl on RecTrailers.TransportationLineId = tl.Id
					LEFT JOIN   Drivers on RecTrailers.DriverId =  Drivers.Id
					LEFT JOIN   StatusTypes CurrentStat ON   CurrentStat.Id =RecTrailers.TrStatus -- CurrentStat.Id =RecTrailers.RecTrStatus

					LEFT JOIN  StatusTypes RecepStat  on   RecepStat.Id =  RecTrailers.TrStatus
					LEFT JOIN  StatusTypes StatGpin  on   StatGpin.Id = CONVERT(int, RecTrailers.OrgGPStatusIn)
					LEFT JOIN  StatusTypes StatGpout  on  StatGpout.Id = CONVERT(int, RecTrailers.OrgGPStatusOut)


				WHERE  -- filtros fijos primero
				--CUSTOMER
				  RecTrailers.SingleCustomerId = ISNULL(@partyRoleId,RecTrailers.SingleCustomerId )
				-- WAREHOUSECUSTOMER
				AND RecTrailers.WarehouseCustomerId  = ISNULL(@intWareCustomerId ,RecTrailers.WarehouseCustomerId)

				-- WAREHOUSE
				AND ( ( RecTrailers.WarehouseId = @lint_WhareHouseId )
					   or
					   ( @isAdmin  =1 )
					)

			   -- sin cancelar 	   
			   AND NOT ( 
						RecTrailers.TrStatus LIKE '%canc%'
						OR
						RecTrailers.TrStatus  LIKE '%rej%'
					   )
               -- FILTROS PERSONALIZADOS
			   AND (
			          -- COMENTADO
			        --( -- si hay filtro de fecha 
					--  @lintDatefilterToCheck =1
					--  AND RecTrailers.ReceivingStart between  @ldtm_StartRange and @ldtm_EndRange 
					--)
					  -- si no hay filtro de fecha es por algun tipo de filtro
					 (
					  -- que tengan el filtro general aplicado
					   @lintfilterapllied =1
					 --  AND   @lintDatefilterToCheck =0 -- no filtro de fecha
					 ---AND RecTrailers.ReceivingStart between  @ldtm_StartRange and @ldtm_EndRange 
					  AND RecTrailers.ReceivingStart between  ISNULL(@ldtm_StartRange ,RecTrailers.ReceivingStart )and ISNULL(@ldtm_EndRange ,RecTrailers.ReceivingStart )
					   -- DEMAS FILTROS 
					   AND RecTrailers.TRFolio = ISNULL( @strTrailerFolio , RecTrailers.TRFolio )
					   AND RecTrailers.Trailer = ISNULL( @strTrailerNumber , RecTrailers.Trailer )
					   AND RecTrailers.TrStatus = ISNULL( @intStatusId , RecTrailers.TrStatus )
					   -- status
					   AND (
							   -- para current status 
							    (  CurrentStat.Status  COLLATE SQL_Latin1_General_CP1_CI_AS
														  IN ( SELECT strName  COLLATE SQL_Latin1_General_CP1_CI_AS
															   FROM #tempStatusCurrent
															 )
									 OR
									 CurrentStat.Status  = ISNULL(@strStatusVal , CurrentStat.Status)
								   )
							   -- para los de ingresoRecepStatus 
							   OR
							   (
							     RecepStat.Status COLLATE SQL_Latin1_General_CP1_CI_AS
														  IN ( SELECT strName  COLLATE SQL_Latin1_General_CP1_CI_AS
															   FROM #tempStatusRecept
															 )
							   )
							   -- para los ORgGPStatus 
							   OR
							   (
							   StatGpin.Status  COLLATE SQL_Latin1_General_CP1_CI_AS
														  IN ( SELECT strName  COLLATE SQL_Latin1_General_CP1_CI_AS
															   FROM #tempOrgStatusIn
															 )
							   )
							   OR
									 CurrentStat.Status  = ISNULL(@strStatusVal , CurrentStat.Status)
							 ) -- status

					  
					 )
			       )
		       		
			
			Order by RecTrailers.Id ASC
				

		-- el carrier es el transportation line
		  -- retornar tabla 
		  SELECT  Id  AS 'Id'
		         ,DtmRegistrationDate  AS 'DtmRegistrationDate'
				 ,DtmReceivedDate  AS 'DtmReceivedDate'
				 ,strTrailerFolio AS 'strTrailerFolio'
				 ,strTrailerNumber AS 'strTrailerNumber'
				 ,strSeal AS 'strSeal'
				 ,strCarrierLine  AS 'strCarrierLine'
				 ,strDriverName  AS 'strDriverName'
				 ,strStatus  AS 'strStatus'
				 ,intCustomerId AS 'intCustomerId'
				 ,intWareHouseId  AS 'intWareHouseId'

		  FROM #tempTrailerList
		
		
	 END --IF ( @lintfilterapllied =1)
	 
	 END -- BEGIN
	 --RETURN 0 