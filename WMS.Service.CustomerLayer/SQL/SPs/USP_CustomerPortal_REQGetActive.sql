USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_REQGetActive] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 04-11-2024
-- Description:	Consulta de requerimientos filtrado por activos (opción por default)
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_REQGetActive](
	@UserId NVARCHAR(50)
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
	SET @lintDatefilterToCheck =0
	-------
	SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
	SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )

	-----------
	IF ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025) )
	BEGIN
	 	    SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-07-20 00:00' ) 
			SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-07-20 23:59'  ) 	     
	END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )


	-----
    --crear tabla de resultados 	
	CREATE TABLE 
		#tempRequirementsList(
			ID int IDENTITY(1,1) PRIMARY KEY,
			DtmCurrentDate DATETIME NULL,
			strREQFolio VARCHAR(50) NULL,
			strCustomerFolio VARCHAR(50) NULL,
			intAdvancePercentage DECIMAL(9,3) NULL,
		)
	----------------
	--strReceinvingFolio = RectrailerShipments .RECFolio
	
	--insertar tabla de resultados
	INSERT INTO 
		#tempRequirementsList(DtmCurrentDate ,strREQFolio ,strCustomerFolio, intAdvancePercentage)
	SELECT 
		req.CurrentDate,
		req.REQFolio,
		extreq.ReqFolio,
		COALESCE((NULLIF(subquery.Picking, 0) / subquery.Assigned ) * 100, 0) AS intAdvancePercentage
	FROM 
		ExternalRequirements extreq
	FULL OUTER JOIN 
		Requirements AS req ON extreq.Id = req.ExternalReqId
	LEFT JOIN (
		SELECT 
			RequirementId,
			SUM(QtyAssigned) AS Assigned,
			SUM(Picking) AS Picking
		FROM 
			RequirementDetails
		GROUP BY 
			RequirementId
	) AS subquery ON req.Id = subquery.RequirementId
	WHERE  -- filtros fijos primero
		(req.CustomerId = ISNULL(@partyRoleId, req.CustomerId) OR req.CustomerId IS NULL)
		AND (req.CQCustomerId = ISNULL(@intWareCustomerId, req.CustWhsId) OR req.CQCustomerId IS NULL)
		AND (req.ReqStatus IS NULL OR (req.ReqStatus <> 69 AND req.ReqStatus <> 68))
		AND (extreq.ReqFolio IS NOT NULL)
		--CUSTOMER
	--	req.CustomerId = ISNULL(@partyRoleId,req.CustomerId)
	--	-- WAREHOUSECUSTOMER
	--AND req.CQCustomerId  = ISNULL(@intWareCustomerId ,req.CustWhsId)
	----	-- WAREHOUSE
	----AND ((req.CustWhsPlantId = @lint_WhareHouseId) OR (@isAdmin  =1))
 --       -- FILTROS PERSONALIZADOS
	----AND req.ReceivingStart between  ISNULL(@ldtm_StartRange ,req.ReceivingStart )and ISNULL(@ldtm_EndRange ,req.ReceivingStart )
	--AND req.ReqStatus <> 69
	--AND req.ReqStatus <> 68
	ORDER BY
		req.Id ASC
				
	SELECT 
		DtmCurrentDate as 'dtmCurrentDate',
		strREQFolio as 'strREQFolio',
		strCustomerFolio as 'strCustomerFolio',
		intAdvancePercentage as 'intAdvancePercentage'
	FROM 
		#tempRequirementsList
	GROUP BY 
		DtmCurrentDate,
		strREQFolio,
		strCustomerFolio,
		intAdvancePercentage

	RETURN 0
END
