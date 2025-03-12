USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetListbySupplierDate]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetListbySupplierDate]
--ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetListbySupplierDate]

(@strSupplierName varchar(50) -- Folio #
,@intUserId INT NULL
,@intSupplierId INT NULL
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
	
	IF (  LEN (ISNULL(@strSupplierName,'') ) >2)
	 BEGIN	 
	  SET @intSupplierId= NULL   
	 END 
	 ELSE  ---IF (  LEN (ISNULL(@strCustomerName,'') ) >2)
	 BEGIN
	  SET  @strSupplierName = NULL
	 END ---ELSE  ---IF (  LEN (ISNULL(@strCustomerName,'') ) >2)
	------------

	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempReceivingList(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,intSupplierid INT NULL
				   ,strSuppliername VARCHAR(100) NULL
				   ,strReceinvingFolio VARCHAR(50) NULL
				   ,DtmReceivedDate DATETIME NULL
				   ,strTrailerFolio VARCHAR(50) NULL
				   
				   )
	----------------
	
			 --insertar tabla de resultados 
		INSERT INTO #tempReceivingList(strReceinvingFolio ,strTrailerFolio 
		                                  ,DtmReceivedDate ,intSupplierid 
										  , strSuppliername )

	-------------------

			 SELECT 
			     --strReceinvingFolio ,strTrailerFolio 
				 rts.RECFolio, rec.TRFolio
				 --DtmReceivedDate ,intCustomerId
				 ,rec.ReceivingStart 
				 -- intSupplierid
				 , bc.SupplierId
				 --strSuppliername 
				 ,bc.Supplier

				 FROM RecTrailers rec
				 INNER JOIN RectrailerShipments rts on rts.RecTrailerId= rec.Id
				 INNER JOIN BlindCounts  bc on bc.RecTrailerShipmentId = rts.Id
				 --INNER JOIN Suppliers sup on sup.Id = bc.SupplierId
				 
				WHERE rec.ReceivingStart BETWEEN  @ldtm_StartRange   AND @ldtm_EndRange 
				and (  UPPER(bc.Supplier ) LIKE '%' +@strSupplierName +'%'
				    OR 
					 bc.Supplier = ISNULL(@strSupplierName , bc.Supplier )
				 )
				and bc.SupplierId = ISNULL(@intSupplierId ,bc.SupplierId )
				
			  Order by rec.Id ASC   



		 SELECT    --ID  AS 'rowId' 
		           intSupplierid  AS 'intSupplierid'
				   ,strSuppliername AS 'strSuppliername'
				   ,strReceinvingFolio AS 'strReceinvingFolio'				   
				   ,DtmReceivedDate as 'dtmReceivedDate'
				  , strTrailerFolio as 'strTrailerFolio'
		 FROM #tempReceivingList		 
		 GROUP BY  intSupplierid  ,strSuppliername ,strReceinvingFolio ,DtmReceivedDate , strTrailerFolio 
		 ORDER BY DtmReceivedDate  ASC
		 RETURN 0

	 
	 END -- BEGIN
	 --RETURN 0 
			