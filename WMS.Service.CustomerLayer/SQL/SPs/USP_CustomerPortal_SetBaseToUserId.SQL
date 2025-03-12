
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_SetBaseToUserId] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER   PROCEDURE [dbo].[USP_CustomerPortal_SetBaseToUserId]


(@intUserIdAdmin INT
,@intUserIdToAssing int
 ,@strUrl nvarchar(300)  
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	 
	 declare @lstr_username varchar(50)
	 declare @lint_id int
	 declare @lstr_msg varchar(200)
	 declare @intOptionId  int 

	 set @lstr_msg  =''
	 
	 SELECT @lstr_username = us.UserId 
	 FROM Security.Users us	 	
	 where  us.Id  = @intUserIdAdmin

    set	 @intOptionId =0
	-- buscar si tiene opcion con mudolo 5
	SELECT @intOptionId  = MAX(CustomerOptions.intOptionId)
	FROM CustomerOptions
	WHERE intModuleId = 5
	AND intUserId = @intUserIdToAssing

	SET @intOptionId = 	ISNULL(@intOptionId,0)
	SET @lint_id  =0


	-- si la opcion es 0 encontes insertar 
	IF (@intOptionId =0)
	BEGIN 

		INSERT INTO CustomerOptions
				   (intModuleId,intUserId				   
				   ,strUrl
				   ,strCreatedBy,dtmCreated,strLastmodifiedBy,dtmLastModfied
				   ,intCustOptionActive
				   )
			 VALUES
				   (
				   --intModuleId,intUserId
				   5,@intUserIdToAssing
				   --,strUrl
				   ,@strUrl
				   --,strCreatedBy,dtmCreated,strLastmodifiedBy,dtmLastModfied
				   ,@lstr_username , GETDATE(), @lstr_username , GETDATE()
				   --intCustOptionActive
				   ,1
				   )

			   set @lint_id  = @@IDENTITY
			   set @lstr_msg =''
	END ---IF (@intOptionId =0)

	-- sino es actualizar 
	IF ( @intOptionId >0)
	BEGIN

	 --- si existe actualizar
	 IF EXISTS (
	      select @intOptionId 
		  from CustomerOptions
		  where intOptionId =@intOptionId 
	   )
		 BEGIN
		 
			 UPDATE CustomerOptions
		   set intCustOptionActive =1
		     ,strUrl=@strUrl
			  ,strLastmodifiedBy = @lstr_username 
			,dtmLastModfied = getdate()
		   where intOptionId =@intOptionId 
	   
	       SET @lint_id  = @intOptionId 
		 END 
	 ELSE
	    BEGIN
		 SET @lint_id  = -1
		 set @lstr_msg ='No se encontro opcion con id='+ CONVERT(varchar(8),@intOptionId )
		END
	   

	  
	  
	END --IF ( @intOptionId >0)
	
	SELECT @lint_id AS'intOptionId' 
	       ,@lstr_msg  as 'strError'



	--WHERE Security.Users.Id = @UserId
END