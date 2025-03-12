USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_InsertUpdateOption]    Script Date: 17/01/2025 07:51:16 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER   PROCEDURE [dbo].[USP_CustomerPortal_UpdateCustomOptions]


(@intUserIdAdmin INT
,@intOptionId INT null
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

	BEGIN

	 --- si existe actualizar
	 IF EXISTS (
	      select @intOptionId 
		  from CustomerOptions
		  where intOptionId =@intOptionId 
	   )
		 BEGIN
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