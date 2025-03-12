
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetWareHouses]
(@UserId INT NULL
)
AS
BEGIN 
	select wh.Id as 'intwarehouseid'
	,wh.Warehouse as'strWarehouse'

	from Warehouses wh
	where wh.Active =1

END 



