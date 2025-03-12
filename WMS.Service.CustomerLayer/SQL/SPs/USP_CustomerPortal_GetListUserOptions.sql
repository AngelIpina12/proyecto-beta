
/****** Object:  StoredProcedure [dbo].[[USP_CustomerPortal_GetListUserOptions]] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetListUserOptions]


(@UserAdminId INT)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED


			 
	 SELECT  cop.intOptionId as 'intOptionId'
	 ,cop.intModuleId as 'intModuleId'
	 ,cmod.strModuleName as 'strModuleName'
	 ,cop.intUserId as 'intUserId'
	 ,cop.strTitle +'('+  cop.strLegend +')' AS 'strDisplayText'
	 ,us.UserId as 'strUserId'	 
	 ,cu.Name as 'strCustomerName'
	 , isnull(cop.intCustOptionActive,0) as 'intCustOptionActive'
	 
     FROM CustomerOptions cop 
	 inner join CustomerModules cmod on cmod.intModuleId = cop.intModuleId 
	 inner join Security.Users us on us.Id = cop.intUserId
	 left join Customers cu on cu.Id = us.PartyRoleId

	 ---	
	-- and us.PartyRoleId = @intcustomer 
	 order by  cop.intOptionId  asc
	 --

END