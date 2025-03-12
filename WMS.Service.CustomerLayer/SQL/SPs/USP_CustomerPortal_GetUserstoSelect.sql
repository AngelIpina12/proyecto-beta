
/****** Object:  StoredProcedure [dbo].[[USP_CustomerPortal_GetUserstoSelect]] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetUserstoSelect]


(@UserId INT
,@intWareHouseId int 
,@intCustomerId int
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	declare  @intcustomer int 
	set @intcustomer =0

	--select  @intcustomer  = max(ubase.PartyRoleId)
	--from Security.Users ubase
	--where ubase.Id = @UserId

	select @intcustomer =ISNULL(@intcustomer ,0)
			 
	 SELECT us.Id as 'intUserId'
	       ,us.UserId as 'strUserId'
		   ,us.FirstName as 'strFirstName'
		   ,us.LastName as 'strLastName'
		   ,cu.Name as 'strCustomerName'
	 FROM Security.Users us	 	
	 inner join Customers cu on cu.Id = us.PartyRoleId
	 inner join Security.UserRoles urol on urol.UserId = us.Id
     inner  join Security.Roles  rol on  rol.Id = urol.RoleId
   
	 where us.IsActive =1
	 and rol.RoleName='Customer Portal'
	 and us.WarehouseId = @intWareHouseId
     and us.PartyRoleId = @intCustomerId
	 ---	
	-- and us.PartyRoleId = @intcustomer 
	 order by us.UserId  asc
	 --

END