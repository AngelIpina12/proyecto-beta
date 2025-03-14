USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_REQSaveExternalRequirements]    Script Date: 20/11/2024 04:48:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		José Ángel Ipiña Jiménez
-- Create date: 14-11-2024
-- Description:	Inserción de requerimientos externos
-- =============================================
ALTER PROCEDURE [dbo].[USP_CustomerPortal_REQSaveExternalRequirements]
    @Id INT = NULL,
	@AddedBy VARCHAR(20) = NULL,
    @AddedDate VARCHAR(20) = NULL,
    @MaterialFrom INT = NULL,
    @ReqTypeId INT = NULL,
	@ReqDate VARCHAR(20) = NULL,
	@ReqTime VARCHAR(20) = NULL,
	@ReqFolioNumber VARCHAR(50) = NULL,
    @ReqFolio VARCHAR(50) = NULL,
	@IsOverrideTimeToFulfill INT = 0,
    @ExtReqDetails TVP_CustomerPortal_REQExternalRequirementsDetails READONLY,
    @res INT OUT
AS
BEGIN
    SET NOCOUNT ON;

	DECLARE @lint_WhareHouseId int
	DECLARE @partyRoleId INT, @ExternalId INT	
	DECLARE @isAllWareHouses INT
	DECLARE @isAdmin INT
	DECLARE @strCustomerName varchar(100)
	DECLARE @strPartyRoleName varchar(100)
	DECLARE @intRoleId INT
	DECLARE @strWhareHousename varchar(100)
	DECLARE @lstrFirstName varchar(100)
	DECLARE @lstrLastName varchar(100)
	DECLARE @lstrUsername varchar(20)
	DECLARE @CQCustomerId INT

	SET @lint_WhareHouseId =0
	SET @partyRoleId =NULL
	SET @ExternalId  =0
	SET @isAdmin =0

	SELECT  
		@partyRoleId = Security.Users.PartyRoleId,
		@ExternalId = Security.Users.ExternalTypeId,
		@lint_WhareHouseId = Security.Users.WarehouseId,
		@isAllWareHouses = Security.Users.AllWarehouses,
		@lstrFirstName = Security.Users.FirstName,
		@lstrLastName = Security.Users.LastName,
		@lstrUsername = Security.Users.UserId 
	FROM 
		Security.Users 	 	
	WHERE 
		Security.Users.Id = @AddedBy

	-- OBTENER LOS NOMBRES DEL ROL
	SELECT
		@strPartyRoleName = Security.Roles.RoleName
	FROM 
		Security.Roles
	WHERE 
		Security.Roles.Id = @intRoleId  

	-- SI ES ADMIN, VOLVER A MARCARLO
	IF (@strPartyRoleName ='Admins')
		BEGIN
		SET @isAdmin =1
	END 

	-- OBTENER CLIENTE
	SELECT 
		@CQCustomerId = Customers.WarehouseCustomerId
	FROM 
		Customers
	WHERE 
		Customers.Id = @partyRoleId

    BEGIN TRANSACTION;

    BEGIN TRY

        BEGIN
            INSERT INTO ExternalRequirements (CQCustomerId ,MaterialFrom, ReqTypeId, ReqDate, ReqTime, ReqFolio, ReqFolioStr, AddedBy, AddedDate, ExtReqGuid, IsOverrideTimeToFulfill)
            VALUES (@CQCustomerId ,@MaterialFrom, @ReqTypeId, @ReqDate, @ReqTime, @ReqFolioNumber, @ReqFolio, @AddedBy, @AddedDate, NEWID(), @IsOverrideTimeToFulfill);

            SET @Id = SCOPE_IDENTITY();
        END

        INSERT INTO ExtReqDetails (ExternalReqId, SKU, Qty, Lot, ProductionLine, PO, Release, Comment)
        SELECT @Id, SKU, Quantity, Lot, ProductionLine, PO, Release, Comment
        FROM @ExtReqDetails;

        COMMIT TRANSACTION;

        SET @res = 1;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END

        SET @res = -1;

        THROW;
    END CATCH
END


