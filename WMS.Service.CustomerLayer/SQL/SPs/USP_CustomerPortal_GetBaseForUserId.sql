
/****** Object:  StoredProcedure [dbo].[[USP_CustomerPortal_GetBaseForUserId]] ******/
GO
CREATE or ALTER PROCEDURE [dbo].[USP_CustomerPortal_GetBaseForUserId]
(@UserId INT)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	declare @lstrol varchar(22)
	set @lstrol =''

	
	      select @lstrol = max(rol.RoleName)
		  from Security.Users us 
		   LEFT join  Security.UserRoles urol on urol.UserId = us.Id
			LEFT  join Security.Roles  rol on  rol.Id = urol.RoleId
	            where  us.Id = @UserId 
				and rol.RoleName in ('Admin')

		IF (@lstrol ='Admin')
		BEGIN
		 SET @UserId  = NULL
		END 
	 ---
		 SELECT intOptionId AS 'intOptionId'
		  ,intModuleId AS 'intModuleID'
		  ,intCustOptionActive AS 'intActive'
	      ,strTitle AS 'strTitle'
		  ,strLegend AS 'strLegend'
		  ,strUrl AS 'strUrl'
		  ,strTitle +'('+  strLegend +')' AS 'strDisplayText'
		 
	 FROM CustomerOptions cop	
	 WHERE intUserId = ISNULL(@UserId ,intUserId )	 
	 and (
	      ( cop.intModuleId =5
	        or 
			(@lstrol ='Admin')
			)
	   )

		 
END