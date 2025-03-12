--USE [WMSDEV]
USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_CATInvSupplierSKU]    **/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Francisco Javier Cadena Hernández
-- Create date: 05-12-2024
-- Description:	De suppliers SKU de un id de usuario
-- =============================================

CREATE PROCEDURE [dbo].[USP_CustomerPortal_CATInvSupplierSKU]
--ALTER PROCEDURE [dbo].[USP_CustomerPortal_CATInvSupplierSKU]

----WMSPREPROD.WMSPREPRODDBV24.dbo.
----WMSPREPROD.WMSPREPRODDBV24.Security

(@intUserId INT NULL
,@strSupSKU VARCHAR(30) NULL
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	   
	DECLARE @lintCustomerId int	
	set @lintCustomerId  =0
	
	SELECT @lintCustomerId=us.PartyRoleId	       
	--FROM WMSPREPROD.WMSPREPRODDBV24.Security.Users us
	FROM Security.Users us
	WHERE us.Id =@intUserId 

	
		select  top 10 idet.ProductNumber as 'strSupplierSKU'
		from Inventory inv 
		inner join InventoryDetails idet on idet.InventoryId = inv.Id
		where inv.CustomerId=328
		and idet.ProductNumber  like '%'+@strSupSKU+'%'
		group by idet.ProductNumber
	
	 END -- BEGIN
	 --RETURN 0 
			 