USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetListbySKUDate]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetListbySKUDate]
--ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetListbySKUDate]

(@strSKU varchar(50) -- Folio #
,@intUserId INT NULL
,@dtmStartDate  datetime = NULL
,@dtmEndDate    datetime = NULL
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

	set @ldtm_ValidDate ='20010101 00:00'

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
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.UserRoles usr
	FROM Security.UserRoles usr
	WHERE  usr.UserId = @intUserId 
	--WHERE Security.UserRoles.UserId  = @aint_UserId

	--obtener los nombres del rol
	SELECT @strPartyRoleName = rol.RoleName
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Roles rol
	FROM Security.Roles rol
	WHERE rol.Id = @intRoleId  


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
	--- BEGIN
	--- 	       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-07-20 00:00' ) 
	---		   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-07-20 23:59'  ) 	     
	-- END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )

	------- PARAM,ETROS VALIDACION
	
	IF (  (ISNULL( @dtmStartDate ,@ldtm_ValidDate)= @ldtm_ValidDate ) OR (ISNULL( @dtmEndDate   ,@ldtm_ValidDate)= @ldtm_ValidDate ) )
	 BEGIN
  	     SET  @ldtm_StartRange  = @ldtm_StartRange  
		  SET  @ldtm_EndRange = @ldtm_EndRange 
	 END 
	ELSE 
	 BEGIN

	   --- ajustar rango inicial 

	     SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate ) ) 

		 -- ajustar rango final	 

		SET  @ldtm_EndRange = CONVERT(DATETIME , CONVERT( DATE, @dtmEndDate ) )

		set  @ldtm_EndRange =DATEADD(hh, 23, @ldtm_EndRange  )
		set  @ldtm_EndRange =DATEADD(mi, 59, @ldtm_EndRange  )

	 END 
	
	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempReceivingList(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,strReceinvingFolio VARCHAR(50) NULL
				   ,strTrailerFolio VARCHAR(50) NULL
				   ,DtmReceivedDate DATETIME NULL
				   ,strSKU VARCHAR(50) NULL

				   )
	----------------
	
			 --insertar tabla de resultados 
		INSERT INTO #tempReceivingList(strReceinvingFolio ,strTrailerFolio 
		                                  ,DtmReceivedDate ,strSKU )

	-------------------

			 SELECT 
			     --strReceinvingFolio ,strTrailerFolio 
				 rts.RECFolio, rec.TRFolio
				 --DtmReceivedDate ,strSKU 
				 ,rec.ReceivingStart , prod.Name


				 FROM RecTrailers rec
				 -- ---- --- FROM WMSPREPROD.WMSPREPRODDBV24.dbo.RecTrailers rec
				  INNER JOIN RectrailerShipments rts on rts.RecTrailerId= rec.Id
				  INNER JOIN BlindCounts BCM  ON BCM.RecTrailerShipmentId = rts.Id
				  INNER JOIN CustomerProducts custprod on custprod.Id = BCM.CustomerProductId --- invdet.CustomerProductId
				  INNER JOIN Products prod on prod.Id = custprod.ProductId

				WHERE  UPPER(prod.Name )LIKE '%'+ UPPER(@strSKU)  +'%'
				AND rec.ReceivingStart between @ldtm_StartRange  and @ldtm_EndRange 

				--GROUP BY rts.RECFolio , rec.TRFolio , rec.ReceivingStart, prod.Name
			
					Order by rec.Id ASC
		 
				
			  -----------------
        SELECT  
			 --  ID
			 (
			  SELECT MIN(TIN.ID)
			  FROM #tempReceivingList TIN
			  WHERE TIN.strReceinvingFolio   =RET.strReceinvingFolio
			  AND TIN.DtmReceivedDate = RET.DtmReceivedDate
			  AND TIN.strTrailerFolio = RET.strTrailerFolio
			 )
			 AS 'rowId' 

			  ,RET.strReceinvingFolio  AS 'strReceinvingFolio'
			  ,RET.DtmReceivedDate AS 'DtmReceivedDate'
			  ,RET.strTrailerFolio AS 'strTrailerFolio'
			  
              --,strSKU  AS 'strSKU'
		 FROM #tempReceivingList RET
		 group by   RET.strReceinvingFolio  ,RET.DtmReceivedDate ,RET.strTrailerFolio 
			
		 ORDER BY RET.DtmReceivedDate 

		 RETURN 0

	 
	 END -- BEGIN
	 --RETURN 0 
			