USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_REQGetListBySKUEndCustomer] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 06-11-2024
-- Description:	Consulta de requerimientos filtrado por SKU End Customer (seleccionado en combo)
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_REQGetListBySKUEndCustomer](
	@intUserId				INT NULL,
	@strSKUEndCustomer		NVARCHAR(50),
	@dtmStartDate			DATETIME = NULL,
	@dtmEndDate				DATETIME = NULL
)
AS
BEGIN
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

    -- DECLARE @aint_UserId int
	DECLARE @lint_WhareHouseId int

	-- DECLARACIÓN DE VARIABLES DE DATOS DE USUARIO
	DECLARE  @partyRoleId INT, @ExternalId INT	
	DECLARE  @isAllWareHouses INT
	DECLARE  @isAdmin INT	
	DECLARE  @strPartyRoleName varchar(100)
	DECLARE  @strCustomerName  varchar(100)
	DECLARE  @intRoleId INT	
	DECLARE  @intWareCustomerId INT


	DECLARE @lintfilterapllied INT 
	DECLARE @lintDatefilterToCheck INT 
	declare @ldtm_ValidDate datetime
	DECLARE @ldtm_StartRange  DATETIME
	DECLARE @ldtm_EndRange  DATETIME
	DECLARE @lstrUserId VARCHAR(30) 

	set @ldtm_ValidDate ='20010101 00:00'

	-- OBTENCIÓN DE DATOS DE USUARIOS
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

	-- OBTENER NOMBRE DEL ROL
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

	-- SI ES ADMIN, ENTONCES VALIDARLO
	IF (@strPartyRoleName ='Admins')
		BEGIN
			SET @isAdmin =1
		END 

	-- SI EL @intWareCustomerId ES O , HACERLO NULL
	IF ( @intWareCustomerId=0)
		BEGIN
			SET @intWareCustomerId = NULL
		END 
	  
	-- ASIGNACIÓN DE VALORES A VARIABLES DE BANDERAS
	SET @lintfilterapllied=0
	set @lintDatefilterToCheck =0

	SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, GETDATE() ) )
	SET  @ldtm_EndRange = DATEADD(MS, -2, DATEADD(D, 1, @ldtm_StartRange)  )

	 IF ( ( @isAdmin  =1 ) or (@lstrUserId='FranciscoJCH')   or (@intUserId =3025)  )
	 BEGIN
		       SET  @ldtm_StartRange  = CONVERT(DATETIME , '2023-07-20 00:00' ) 
			   SET  @ldtm_EndRange =  CONVERT(DATETIME , '2023-07-20 23:59'  ) 	     
	 END --  ( ( @isAdmin  =1 ) or (@strUserId='FranciscoJCH')   or (@UserId =3025)  )

	-- PARÁMETROS PARA VALIDACIÓN
	IF (  (ISNULL( @dtmStartDate ,@ldtm_ValidDate)= @ldtm_ValidDate ) OR (ISNULL( @dtmEndDate   ,@ldtm_ValidDate)= @ldtm_ValidDate ) )
		BEGIN
  			SET  @ldtm_StartRange  = @ldtm_StartRange  
			SET  @ldtm_EndRange = @ldtm_EndRange 
		END 
	ELSE 
		BEGIN

		-- AJUSTE DE RANGO INICIAL
	    SET  @ldtm_StartRange  = CONVERT(DATETIME , CONVERT( DATE, @dtmStartDate ) ) 

		-- AJUSTE DE RANGO FINAL
		SET  @ldtm_EndRange = CONVERT(DATETIME , CONVERT( DATE, @dtmEndDate ) )

		SET  @ldtm_EndRange =DATEADD(hh, 23, @ldtm_EndRange  )
		SET  @ldtm_EndRange =DATEADD(mi, 59, @ldtm_EndRange  )
	END 
	
	--IF (  LEN (ISNULL(@strSKUEndCustomer,'') ) >2)
	--	BEGIN	 
	--		SET @intCustomerId  = NULL   
	--	END 
	--ELSE  ---IF (  LEN (ISNULL(@strSKUEndCustomer,'') ) >2)
	--	BEGIN
	--		SET  @strSKUEndCustomer = NULL
	--	END ---ELSE  ---IF (  LEN (ISNULL(@strSKUEndCustomer,'') ) >2)

    --- CREAR TABLA DE RESULTADOS
	CREATE TABLE 
		#tempRequirementList(
			ID int IDENTITY(1,1) PRIMARY KEY,
			strSKUEndCustomer VARCHAR(50) NULL,
			strUOM NVARCHAR(50) NULL,
			strREQFolio VARCHAR(50) NULL,
			intFOLIO INT NULL,
			dtmCurrentDate DATETIME NULL,
			intAdvancePercentage DECIMAL(18,3) NULL,
			decQuantity DECIMAL(18, 3) NULL,
			decQtyAssigned DECIMAL(18, 3) NULL,
			decPendingQty DECIMAL(18, 3) NULL,
			intPicking INT NULL,
			decQtyShipped DECIMAL(18, 3) NULL,
			intInventoryId INT NULL,
			intShipmentId INT NULL
		)
	
	-- INSERTAR TABLA DE RESULTADOS
	INSERT INTO 
		#tempRequirementList(
			strSKUEndCustomer,
			strUOM,
			strREQFolio,
			intFOLIO,
			dtmCurrentDate,
			intAdvancePercentage,
			decQuantity,
			decQtyAssigned,
			decPendingQty,
			intPicking,
			decQtyShipped,
			intInventoryId,
			intShipmentId
		)
	SELECT 
		reqdet.PartNumber,
		CASE WHEN proUOM.Id IS NULL THEN 'No hay UOM' ELSE proUOM.Name END AS strUOM,
		req.REQFolio,
		req.FOLIO,
		req.CurrentDate,
		COALESCE((subquery.TotalRemainingQuantity / NULLIF(subquery.TotalQuantity, 0)) * 100, 0) AS intAdvancePercentage,
		reqdet.Quantity,
		reqdet.QtyAssigned,
		reqdet.PendingQty,
		reqdet.Picking,
		CASE 
			WHEN EXISTS (
				SELECT 1 
				FROM ShipmentDetails 
				WHERE Status = 188 AND ReqDetailId = reqdet.Id
			)
			THEN (
				SELECT TOP 1 PickedQuantity 
				FROM ShipmentDetails 
				WHERE Status = 188 AND ReqDetailId = reqdet.Id
			)
			ELSE 0.000
		END AS decQtyShipped,
		inv.Id,
		SD.ShipmentId
	FROM 
		Requirements req
	LEFT JOIN 
		RequirementDetails reqdet ON req.Id = reqdet.RequirementId
	LEFT JOIN
		CustomerProducts AS cuspro ON reqdet.CustomerProductId = cuspro.Id
	LEFT JOIN
		Products AS pro ON cuspro.ProductId = pro.Id
	LEFT JOIN
		ProductUoms AS proUOM ON pro.ProductUomId = proUOM.Id
	LEFT JOIN
		ShipmentDetails AS SD ON reqdet.Id = SD.ReqDetailId
	LEFT JOIN
		InventoryDetails AS invdet ON SD.InventoryDetailId = invdet.Id
	LEFT JOIN
		Inventory AS inv ON invdet.InventoryId = inv.Id
	LEFT JOIN (
		SELECT 
			RequirementId,
			SUM(Quantity) AS TotalQuantity,
			SUM(RemainingQuantity) AS TotalRemainingQuantity
		FROM 
			RequirementDetails
		GROUP BY 
			RequirementId
	) AS subquery ON req.Id = subquery.RequirementId
	WHERE
		reqdet.CurrentDate BETWEEN @ldtm_StartRange AND @ldtm_EndRange 
	AND 
	(
		reqdet.PartNumber LIKE '%' +@strSKUEndCustomer  +'%'
	OR 
		reqdet.PartNumber = ISNULL(@strSKUEndCustomer ,reqdet.PartNumber)
	)
	AND
		req.CustomerId = ISNULL(@partyRoleId,req.CustomerId)
	AND
		req.CQCustomerId  = ISNULL(@intWareCustomerId ,req.CustWhsId)
	AND 
		req.ReqStatus <> 69
	AND 
		req.ReqStatus <> 68
	ORDER BY 
		req.Id ASC   

	-- RETORNAR DATOS
	SELECT
		strSKUEndCustomer as 'strSKUEndCustomer',
		strUOM as 'strUOM',
		strREQFolio as 'strREQFolio',
		intFOLIO as 'intFOLIO',
		dtmCurrentDate as 'dtmCurrentDate',
		intAdvancePercentage as 'intAdvancePercentage',
		decQuantity as 'decQuantity',
		decQtyAssigned as 'decQtyAssigned',
		decPendingQty as 'decPendingQty',
		intPicking as 'intPicking',
		decQtyShipped as 'decQtyShipped',
		intInventoryId as 'intInventoryId',
		intShipmentId as 'intShipmentId'

	FROM 
		#tempRequirementList 
	GROUP BY
		strSKUEndCustomer,
		strUOM,
		strREQFolio,
		intFOLIO,
		dtmCurrentDate,
		intAdvancePercentage,
		decQuantity,
		decQtyAssigned,
		decPendingQty,
		intPicking,
		decQtyShipped,
		intInventoryId,
		intShipmentId

	RETURN 0
END
