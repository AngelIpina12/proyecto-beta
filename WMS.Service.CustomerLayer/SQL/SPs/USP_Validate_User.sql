USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_Validate_User]    Script Date: 03/06/2024 04:23:39 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[USP_Validate_User]
(@UserName  NVARCHAR(20),
@PWD NVARCHAR(200),
@Type NVARCHAR(20)
)
AS
BEGIN 
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
  IF @Type='ValidateUserName'
  BEGIN
   SELECT * FROM Security.Users WHERE UserId=@UserName  
  END
  ELSE IF(@Type = 'PartyRoleUser')
  BEGIN
     DECLARE @partyRoleId INT, @ExternalId INT	

         IF EXISTS(SELECT * FROM security.Users WHERE UserId = @UserName AND PWD = @PWD)
			BEGIN
			SELECT @partyRoleId = PartyRoleId 
			, @ExternalId = ExternalTypeId 
			FROM security.Users WHERE UserId= @UserName AND PWD = @PWD


			 IF(@partyRoleId <> 0 AND @ExternalId = 1)
		   BEGIN
		        SELECT us.*, wc.Id[PartyRoleId],wc.CustomerName[PartyRoleName] ,  ISNULL(( SELECT TOP 1 1 FROM Security.UserRoles ur 
				INNER JOIN Security.Roles r ON r.Id = ur.RoleId 
				WHERE ur.UserId= us.Id AND r.RoleName ='Admins'), 0) AS IsAdminUser ,  

				case when us.AllWarehouses = 0 then 
				coalesce((
				      SELECT STUFF((			
					  select ',' + cast(uswh.WarehouseId as varchar(10))  
					  from UserWarehouses uswh 
					  where  us.Id = uswh.UserId 				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'') 
			
		else 
		coalesce((
		 SELECT STUFF((			
					select ',' + cast(Id as varchar(10))  from
					 Warehouses  				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'')  end	
			AS WHIds FROM Security.Users  us   
           INNER JOIN WarehouseCustomers wc ON wc.Id = us.PartyRoleId
           WHERE us.UserId=@UserName AND us.PWD= @PWD
	END

		ELSE  IF(@partyRoleId <> 0 AND @ExternalId = 3)
		   BEGIN
		   SELECT us.*,wc.Id[PartyRoleId],wc.Name[PartyRoleName] ,  ISNULL(( SELECT TOP 1 1 FROM Security.UserRoles ur 
           INNER JOIN Security.Roles r ON r.Id = ur.RoleId 
            WHERE ur.UserId= us.Id AND r.RoleName ='Admins'), 0) AS IsAdminUser ,  coalesce((
		 SELECT STUFF((			
					select ',' + cast(uswh.WarehouseId as varchar(10))  from
					 UserWarehouses uswh where  us.Id = uswh.UserId 				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'') AS WHIds FROM Security.Users  us   
           INNER JOIN Customers wc ON wc.Id = us.PartyRoleId
           WHERE us.UserId=@UserName AND us.PWD= @PWD
		END
		ELSE
		BEGIN

     

		 SELECT us.*, w.Warehouse[WarehouseName],sup.Id[PartyRoleId],sup.Name[PartyRoleName] , ISNULL(( SELECT TOP 1 1 FROM Security.UserRoles ur 
         INNER JOIN Security.Roles r ON r.Id = ur.RoleId 
          WHERE ur.UserId= us.Id AND r.RoleName ='Admins'), 0) AS IsAdminUser		  
		  ,  
   case when us.AllWarehouses = 0 then 
     coalesce((
		 SELECT STUFF((			
					select ',' + cast(uswh.WarehouseId as varchar(10))  from
					 UserWarehouses uswh where  us.Id = uswh.UserId 				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'') 
			
		else 
		coalesce((
		 SELECT STUFF((			
					select ',' + cast(Id as varchar(10))  from
					 Warehouses  				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'')  end	
			AS WHIds
		    FROM Security.Users  us   
           LEFT JOIN Warehouses w ON w.Id = us.WarehouseId	
		   Inner Join Suppliers sup on sup.Id=  us.PartyRoleId 
           WHERE us.UserId=@UserName AND us.PWD= @PWD 
		END

	END
  END
  ELSE
  BEGIN
   SELECT us.*,  w.Warehouse[WarehouseName],
   case when us.AllWarehouses = 0 then 
     coalesce((
		 SELECT STUFF((			
					select ',' + cast(uswh.WarehouseId as varchar(10))  from
					 UserWarehouses uswh where  us.Id = uswh.UserId 				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'') 
			
		else 
		coalesce((
		 SELECT STUFF((			
					select ',' + cast(Id as varchar(10))  from
					 Warehouses  				
					FOR XML PATH('')
					), 1, 1, '')
		    ),'')  end	
			AS WHIds	, ISNULL(( SELECT TOP 1 1 FROM Security.UserRoles ur  /* change here AddedDate */
   INNER JOIN Security.Roles r ON r.Id = ur.RoleId 
   WHERE ur.UserId= us.Id AND r.RoleName ='Admins'), 0) AS IsAdminUser  FROM Security.Users  us   
   LEFT JOIN Warehouses w ON w.Id = us.WarehouseId
   WHERE us.UserId=@UserName and us.PWD= @PWD  
	end
END

