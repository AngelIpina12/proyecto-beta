
/****** Object:  StoredProcedure [dbo].[[USP_CustomerPortal_InsertUpdateOption]] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER   PROCEDURE USP_CustomerPortal_InsertUpdateOption


(@intUserIdAdmin INT
,@intOptionId INT null
,@intModuleId int
,@intUserIdToAssing int
,@strTitle nvarchar(100) 
 ,@strLegend nvarchar(50) 
 ,@strUrl nvarchar(300) 
 ,@intActive int null
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	 
	 declare @lstr_username varchar(50)
	 declare @lint_id int
	 declare @lstr_msg varchar(200)

	 set @lstr_msg  =''
	 
	 SELECT @lstr_username = us.UserId 
	 FROM Security.Users us	 	
	 where  us.Id  = @intUserIdAdmin

    set	 @intOptionId = ISNULL(@intOptionId,0)
	SET @lint_id  =0

	set @intActive = ISNULL(@intActive,0)
	-- si es modulo base 
	IF (@intModuleId  =5)
	BEGIN
	  
	  SET @intOptionId  = 0
	  --- VER SI EXISTE
		SELECT @intOptionId  = MAX(CustomerOptions.intOptionId)
		FROM CustomerOptions
		WHERE intModuleId = 5
		AND intUserId = @intUserIdToAssing

		SET @intOptionId  =  ISNULL(@intOptionId ,0)
	END 
	
	-----------

	-- si la opcion es 0 encontes insertar 
	IF (@intOptionId =0)
	BEGIN 


		INSERT INTO CustomerOptions
				   (intModuleId,intUserId
				   ,strTitle
				   ,strLegend
				   ,strUrl
				   ,strCreatedBy,dtmCreated,strLastmodifiedBy,dtmLastModfied
				   ,intCustOptionActive
				   )
			 VALUES
				   (
				   --intModuleId,intUserId
				   @intModuleId,@intUserIdToAssing
				   --,strTitle
				   ,@strTitle
				   --,strLegend
				   ,@strLegend 
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

		 if (@intModuleId >0)
		 begin
		 	 UPDATE CustomerOptions
		   set intModuleId =@intModuleId			  
			  ,strLastmodifiedBy = @lstr_username 
			,dtmLastModfied = getdate()
		   where intOptionId =@intOptionId 
	   
		 end --@intModuleId >

		 if(@intUserIdToAssing >0)
		 begin
		  	 UPDATE CustomerOptions
			   set intUserId = @intUserIdToAssing			  
				  ,strLastmodifiedBy = @lstr_username 
				,dtmLastModfied = getdate()
		   where intOptionId =@intOptionId 
	   
		 end --@intUserIdToAssing

		 if ( LEN(@strTitle)>2)
		 begin
		 	 UPDATE CustomerOptions
		   set strTitle =@strTitle			  
			  ,strLastmodifiedBy = @lstr_username 
			,dtmLastModfied = getdate()
		   where intOptionId =@intOptionId 
	   
		 end --@strTitle

		 if (LEN(@strLegend )>2)
		 begin
		 	 UPDATE CustomerOptions
		     set strLegend = @strLegend 			  
			  ,strLastmodifiedBy = @lstr_username 
			,dtmLastModfied = getdate()
		   where intOptionId =@intOptionId 
	   
		 end --@strLegend 
		 		 
		 if (LEN(@strUrl)>2)
		 begin
		 	 UPDATE CustomerOptions
		   set strUrl = @strUrl
			  ,strLastmodifiedBy = @lstr_username 
			,dtmLastModfied = getdate()
		   where intOptionId =@intOptionId 
	   
		 end --@strUrl

		UPDATE CustomerOptions
		   set intCustOptionActive =@intActive
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