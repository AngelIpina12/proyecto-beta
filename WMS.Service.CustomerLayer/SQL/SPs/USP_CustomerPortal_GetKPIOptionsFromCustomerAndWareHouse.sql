 
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetKPIOptionsFromCustomerAndWareHouse] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetKPIOptionsFromCustomerAndWareHouse]
 ( @intWarehouseid INT
  ,@intCustomerid INT
  )

AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	 ---
	 SELECT cop.intOptionId AS 'intOptionId'
		  ,cop.intModuleId AS 'intModuleID'
		  ,cmod.strModuleName as 'strModuleName'
	      ,cop.strTitle AS 'strTitle'
		  ,cop.strLegend AS 'strLegend'
		  ,cop.strUrl AS 'strUrl'
		  ,cop.strTitle +'('+  strLegend +')' AS 'strDisplayText'
		  ,cop.intCustOptionActive as 'intCustOptionActive'
		  ,us.Id as 'intuserid'
		  ,us.UserId as 'strUserId'
		  ,us.FirstName +' ' +us.LastName as 'strUserFullName'
		  ,wh.Warehouse as 'strWarehouse'
		  ,wh.Id as 'intWarehouseid'
		  ,cu.Id  as 'intcustomerid'
		  ,cu.Name as 'strCustomerName'
		  
	 FROM CustomerOptions cop
	   inner join CustomerModules cmod on cmod.intModuleId = cop.intModuleId
		inner join Security.Users us on us.Id =cop.intUserId
		inner join Warehouses wh on wh.Id = us.WarehouseId
		inner join Customers cu on cu.Id = us.PartyRoleId
	 WHERE us.WarehouseId = @intWarehouseid 
	 and us.PartyRoleId  = @intCustomerid 
	
			 
END