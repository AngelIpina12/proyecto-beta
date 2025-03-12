
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetCustomersFromWareHouse]
(@UserId INT NULL
,@intWareHouseid INT NULL
)
AS
BEGIN 

	SELECT cus.Id as 'intCustomerId'
	     , cus.Name as 'strCustomerName'
	FROM Customers cus 
	where cus.WarehouseId = @intWareHouseid
	and cus.IsActive =1 


END 
