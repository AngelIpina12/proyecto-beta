USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserInfo] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER PROCEDURE [dbo].[USP_GetUserInfo]


(@UserId INT, 
 @UserName  NVARCHAR(20),
 @PWD NVARCHAR(200),
 @Type NVARCHAR(20)
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
  -- 	DECLARE @aint_UserId int
	DECLARE @lint_WhareHouseId int
	
	--- otros de usuarios 
	DECLARE  @partyRoleId INT, @ExternalId INT	
	DECLARE  @isAllWareHouses INT
	DECLARE  @isAdmin INT
	DECLARE  @strCustomerName varchar(100)
	DECLARE  @strPartyRoleName varchar(100)
	DECLARE  @intRoleId INT
	DECLARE  @strWhareHousename varchar(100)
	DECLARE  @intWareCustomerId INT
	DECLARE  @intCustomerId INT
	DECLARE  @lstrFirstName varchar(100)
	DECLARE  @lstrLastName varchar(100)
	DECLARE  @lstrUsername varchar(20)
	DECLARE  @lint_CanOpenKPIManagerW int

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
		   ,@lstrFirstName  = Security.Users.FirstName
		   ,@lstrLastName = Security.Users.LastName
		  , @lstrUsername  = Security.Users.UserId
		   
	FROM Security.Users 	 	
	WHERE Security.Users.Id = @UserId
	--WHERE Security.Users.Id = @aint_UserId

	
	--obtener los nombres del rol
	SELECT @strPartyRoleName = rol.RoleName
	      ,@intRoleId  =rol.id
	FROM Security.Roles rol
	inner join Security.UserRoles usrol on usrol.RoleId = rol.Id
	WHERE usrol.UserId = @UserId
	and rol.RoleName = 'Admin'

	--- SI ES admins obtener marcarlo
	set @lint_CanOpenKPIManagerW =0
	set  @isAdmin =0

	 IF (@strPartyRoleName ='Admin')
	  BEGIN
	   SET @isAdmin =1
	  END 

	  --- obtener cliente
	 SELECT @strCustomerName = Customers.Name
	  ---obtener cliente de almacen
	      , @intWareCustomerId  = Customers.WarehouseCustomerId
		  , @intCustomerId = Customers.Id
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
	set @lint_CanOpenKPIManagerW =0

	--
	 if (@isAdmin  =1)
	 begin
	   set @lint_CanOpenKPIManagerW =1
	 end 
	 ---
	 IF ( EXISTS ( SELECT us.Id
	              FROM 	Security.Users us
				  WHERE us.Id =@UserId 
				  and us.UserId in ('GabrielaMolina'
				                      ,'carlos'
									  ,'ipiña'
									  ,'FranciscoJCH'
									 -- ,'alopez'
									  )

	   ) )
	   BEGIN
	    set @lint_CanOpenKPIManagerW =1
	   END 
	 ---
	 SELECT   @strCustomerName AS 'Customer'
			 ,@intWareCustomerId AS 'WareCustomerId'
			 ,@intCustomerId AS 'CustomerId'
		     ,@strWhareHousename AS 'WareHouse'
		     ,@isAdmin  as 'isAdmin'
		     ,@strPartyRoleName as 'PartyRoleName'
		     ,@UserId as 'UserId'
			 ,@lstrFirstName  as 'FirstName'
			 ,@lstrLastName  as 'LastName'
			 ,@lstrUsername as 'UserName'
			 ,@lint_WhareHouseId as 'WhareHouseId'
			 ,@lint_CanOpenKPIManagerW as 'CanOpenKPIManagerW'
			 
END