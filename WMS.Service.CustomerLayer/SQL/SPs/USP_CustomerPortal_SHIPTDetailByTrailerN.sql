--USE [WMSDEV]
USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_SHIPTDetailByTrailerN]    **/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Francisco Javier Cadena Hernández
-- Create date: 27-11-2024
-- Description:	Consulta de resumen de shipments en detalle por trailer number
-- =============================================

--CREATE PROCEDURE [dbo].[USP_CustomerPortal_SHIPTDetailByTrailerN]
ALTER PROCEDURE [dbo].[USP_CustomerPortal_SHIPTDetailByTrailerN]

----WMSPREPROD.WMSPREPRODDBV24.dbo.
----WMSPREPROD.WMSPREPRODDBV24.Security

(@intUserId INT NULL
,@strTrailerN varchar(22) NULL
 ,@dtmStartDate datetime = NULL
 ,@dtmEndDate   datetime =NULL
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
	  
	 -------
	      SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate ) )
		  SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @dtmEndDate   )  )

	
	------- PARAM,ETROS VALIDACION


	--tabla  de de shipments 
	CREATE TABLE #tempShipM(
	               ID int IDENTITY(1,1) PRIMARY KEY				   				   
				   ,intRecId INT NULL
				   ,intRecStatOut int null
				   ,intShipTR INT NULL
				   ,intShipId INT NULL
				   ,intShipDet INT NULL
				   ,intReqId INT NULL
				   ,intReqDetId INT NULL
				   ,intSHDTStatusId INT NULL					   
				   
				   ,strCQFolio varchar(100) null
				   ,strCustomerfolio varchar(100)null 
				   
				 
			
				   )
  --- 
  	CREATE TABLE #tempShipBS(
	               ID int IDENTITY(1,1) PRIMARY KEY				   				   
				   ,intRecId INT NULL			
				   ,intShipTR INT NULL
				   ,intShipId INT NULL
				   ,intTrStatus INT NULL
				   ,intStStatus INT NULL
				   ,intShipStatus INT NULL
				   ,intRecStatOut INT NULL
				   ,intQtyPallOut int null
				   ,intQtyPallPend int null 
				   
				   ,strTrailerFolio varchar (100) null
				   ,dtmShipDepatureDate datetime null
				   ,strShipFolio varchar(100) null
				   ,strSeal varchar(100) null
				   ,strTrailerNumber varchar(100) null
				   )

  -- tabla detalles de carga
  --
  
  	CREATE TABLE #tempShipLoadDet(
	               ID int IDENTITY(1,1) PRIMARY KEY	
				   ,intLoadDetId int null
				   ,intShipTrId int null
				   ,intQty int null
				   ,intType int null 
				   )

  --
	
    	 -- obtener ids bases 
		 INSERT INTO #tempShipBS( 
		 		   intRecId  , intRecStatOut 				   
				   ,intShipTR ,intShipId 
				   ,intTrStatus ,intStStatus 
				   ,intShipStatus 
				   ,intQtyPallOut ,intQtyPallPend 
				   --
				   ,strTrailerFolio ,dtmShipDepatureDate 
				   ,strShipFolio
				   ,strSeal 
				   ,strTrailerNumber
				   )
		SELECT 		
			  --,intRecId  , intRecStatOut 				   
			  REC.Id, REC.OrgGPStatusOut
			 --		   ,intShipTR ,intShipId 
			 ,st.Id , SH.Id
			--	  ,intTrStatus ,intStStatus 
			, REC.TrStatus , st.StatusId
			--		   ,intShipStatus 
			, SH.StatusId
			-- ,intQtyPallOut ,intQtyPallPend 
			,st.PalletsOut , st.PendingPalletsOut
			--,strTrailerFolio 
			,REC.TRFolio
			---,dtmShipDepatureDate 
			,convert(datetime, SH.DepartureDate,103) + CAST(SH.DepartureTime as DATETIME)
			--, SH.DepartureDate
			 ---convert(datetime, inv.EntryDate   ,103) + CAST(inv.EntryTime  as DATETIME)

			--strShipFolio
			,SH.SHPFolio
			--strSeal 
			, (
			   CASE WHEN  LEN(ISNULL(REC.ExitSealNumber,'')) > 4  THEN REC.ExitSealNumber
			   	    WHEN  LEN(ISNULL(st.Seal,'')) > 2  THEN st.Seal
				   ELSE SH.seal
			   END 
			  )
			  --strTrailerNumber
			  ,REC.Trailer

		  ---------------
	  ---------------
		    FROM Shipments SH 
			INNER JOIN ShippingTrailers st ON SH.ShippingTrailerId = st.Id
			INNER JOIN RecTrailers REC ON st.RecTrailerId = REC.Id
		   -- INNER JOIN RecTrailerShipments RECS  ON RECS.RecTrailerId = REC.Id
			
			WHERE SH.DepartureDate BETWEEN  @ldtm_StartRange   AND @ldtm_EndRange  
			AND SH.CustomerId=   @lintCustomerId 		

			--- filtrar por trailer folio
			DELETE #tempShipBS
			FROM #tempShipBS BS
			WHERE BS.strTrailerNumber NOT LIKE '%' +@strTrailerN+'%'
			---

	  -- insertar detalle 
	    INSERT INTO #tempShipM( 
				     intRecId ,intRecStatOut 
				   ,intShipTR ,intShipId 
				   ,intShipDet ,intReqId 
				   ,intReqDetId 
				   ,intSHDTStatusId 
				   )
				   
				   SELECT 
				   --intRecId ,intRecStatOut 
				  bs.intRecId,  bs.intRecStatOut
				   --,intShipTR ,intShipId 
				   , bs.intShipTR , bs.intShipId
				   --,intShipDet ,intReqId 
				   ,sdt.Id, sdt.RequirementId
				   ---,intReqDetId 
				   , sdt.ReqDetailId
				   -- ,intSHDTStatusId 
				   ,sdt.Status
				   
				   from #tempShipBS bs
				   inner join ShipmentDetails sdt on bs.intShipId = sdt.ShipmentId
				   where bs.intShipId = sdt.ShipmentId
				   ---
				   --
				   
				   -- obtener informacion de requerimiento 
				   UPDATE #tempShipM				   
				   SET strCQFolio  =  RQ.REQFolio --.REQFolio, Max(isnull(, ''))[CustomerFolio], 
				     ,strCustomerfolio = RQ.ScheduleNumber--req.ScheduleNumber
					FROM #tempShipM M
					 INNER JOIN Requirements RQ ON RQ.Id = M.intReqId
					WHERE RQ.Id = M.intReqId
				   --------------
				   
				   SELECT   BS.strTrailerNumber AS 'strTrailerNumber'
				           ,BS.strTrailerFolio AS 'strTrailerFolio'
				          ,BS.dtmShipDepatureDate AS 'dtmShippedDate'
						  ,M.strCQFolio AS 'strCQFolio'
						  ,M.strCustomerfolio AS 'strCustomerfolio' 
						  ,BS.strShipFolio AS 'strShipFolio'
						  ,BS.strSeal AS 'strSeal'
						  ,BS.intShipId AS 'intShipId'			
						  ,M.intReqId AS 'intReqId'
			
						  
						  
				   FROM #tempShipBS BS
				    INNER JOIN #tempShipM M ON BS.intShipId = M.intShipId
					                        AND BS.intRecId = M.intRecId
				   WHERE BS.intShipId = M.intShipId
					                        AND BS.intRecId = M.intRecId
				 GROUP BY    BS.strTrailerNumber ,BS.strTrailerFolio ,BS.dtmShipDepatureDate 
						  ,M.strCQFolio ,M.strCustomerfolio 
						  ,BS.strShipFolio ,BS.strSeal 
						  ,BS.intShipId ,M.intReqId 
						

	
	-- DROP TABLE #tempRECS
	 DROP TABLE #tempShipBS
	 DROP TABLE #tempShipLoadDet
	 DROP TABLE #tempShipM

	 END -- BEGIN
	 --RETURN 0 
			 