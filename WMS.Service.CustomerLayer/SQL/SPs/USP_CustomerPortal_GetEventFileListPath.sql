
USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetEventFileListPath]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
   --  CREATE PROCEDURE [dbo].[USP_CustomerPortal_GetEventFileListPath]
   ALTER PROCEDURE  [dbo].[USP_CustomerPortal_GetEventFileListPath]

( @aintEventId INT
  ,@aintTrailerId INT NULL
  ,@astrEventName varchar(50) NULL
 
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

    DECLARE @lintTrailerId INT 
	DECLARE @lintShipTrailerId INT
	DECLARE @lintIdx INT 
	DECLARE @lstrEventname varchar(100)
	DECLARE @lintEventType INT
	DECLARE @lintIFileType int
	------
	
	 DECLARE @lint_IdxTab INT
	 DECLARE @lint_IdFile INT
	 DECLARE @lint_FileRefId  INT
	 DECLARE @lint_FileType INT 
	 DECLARE @lstr_FilePath varchar(100)
	 DECLARE @lint_FilePageType INT

	-------
	
    --	crear tabla de resultados 	
	CREATE TABLE #tblFileList(
	               intIndex int 
				   ,intFileId int NULL
				   ,intFileRefId INT NULL
				   ,intFileType INT NULL 
				   ,intFilePage INT NULL
				   ,strFilePath varchar(100) NULL
	            )

	 -- tipos de documentos  y paginas 
	 
	CREATE TABLE #tblFilterDocTypeListsp(
	                intDocType int null
					,intPageType int null
	            )

      --------
	  
	  
	  -- POR ID , SI ES X EVENTID 
	  IF (@aintEventId >0)
	  BEGIN
		-- OBTENER EL NOMBRE DEL EVENTO	    
		-- OBTENER EL NUMERO DE TRAILER
		SELECT  @lstrEventname  = StatusTypes.Status
		        , @lintEventType =  StatusTypes.Id 				
				, @lintTrailerId = TrailerEvents.RecTrailerDBRefId				
		        , @lintShipTrailerId  =TrailerEvents.ShippingTrailerDBRefId

		FROM TrailerEvents
		INNER JOIN  StatusTypes ON StatusTypes.Id = TrailerEvents.EventType
		WHERE TrailerEvents.Id = @aintEventId

	

		 
		 SET @lint_FileType =0
		 SET @lint_FilePageType =0
	 
	           
		 --'Received At Yard',
		 IF ( @lstrEventname = 'Received At Yard')
		 BEGIN

	
		   --
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,2)
			--
			
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,3)
		   --
		   
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,10)
			--
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	        VALUES (1, NULL) 
		
			---
		 END 

		 --'Received At Dock'
		 IF ( @lstrEventname = 'Received At Dock')
		 BEGIN
		 
		  --
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,2)
			--
			
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,3)
		   --
		   --		   
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	        VALUES (1, NULL) 

			   --
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	        VALUES (2,NULL) 
		
		 END 
		 --
		 --'Empty In'
		 IF ( @lstrEventname = 'Empty In')
		 BEGIN
		 
		  --
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,2)
			--
			
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES (NULL,3)
		   --
			--
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	        VALUES (1,NULL) 

		   --
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	        VALUES (2,NULL) 

		 END 


		 -- 'Blind Count Started'
		 --IF ( @lstrEventname = 'Blind Count Started')
		--- BEGIN
		 
		 ---END 


		 ---------
		 -- 'IOS Import'
		 -- 'InProcess (2nd verification)'
		 -- 'ReOpen Trailer'

		 --, 'Loaded'
		 IF ( @lstrEventname = 'Loaded')
		 BEGIN
		  INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES ( NULL,12)
			--

		 END 


		 --, 'Closed',
		 --'Shipping Added'
		--  IF ( @lstrEventname = 'Shipping Added')
		-- BEGIN
		-- END 

          -- 'Pending Departure InProcess'

		  -- 'Ready To Leave'
		
		--   IF ( @lstrEventname = 'Ready To Leave')
		-- BEGIN
		 
	--	 END 


		  -- 'Shipment Departured'		 
		-- IF ( @lstrEventname = 'Shipment Departured')
		 --BEGIN
		 
		-- END 



		  -- 'Shipped'
	     
		  IF ( @lstrEventname = 'Shipped')
		 BEGIN
		   INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
	       VALUES ( NULL,9)
			--
		 
		 END 
		  -- 'Empty Out'
		
		 --
		 	 IF ( @lstrEventname ='Empty Out')
		 BEGIN
			  INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
		     VALUES ( NULL,9)
			--
			INSERT INTO #tblFilterDocTypeListsp(intDocType,intPageType)
		     VALUES ( NULL,10)

		 END 

		--select @lintTrailerId 
		--select * from #tblFilterDocTypeListsp
		
		  -- CURSOR PARA OBTENER LAS FOTOS POR FOLIO POR EL TIPO
		  DECLARE lfcursor CURSOR FOR
		  SELECT DISTINCT Documents.Id , Documents.DocRefId, Documents.DocType,  Documents.PageType ,Documents.Path  
		  FROM Documents 
		     ,	#tblFilterDocTypeListsp
          where @lintTrailerId = Documents.DocRefId
		  and Documents.DocType = ISNULL( #tblFilterDocTypeListsp.intDocType,Documents.DocType )
		  and Documents.PageType = ISNULL(  #tblFilterDocTypeListsp.intPageType,Documents.PageType )

		  OPEN lfcursor
		  FETCH NEXT FROM lfcursor INTO @lint_IdFile ,@lint_FileRefId  ,@lint_FileType, @lint_FilePageType  ,@lstr_FilePath 


		    WHILE @@FETCH_STATUS =0
			BEGIN

			     SET @lint_IdxTab =0

				 -- obtener el id maximo de la tabla 
				 SELECT @lint_IdxTab   = MAX(#tblFileList.intIndex)
				 FROM #tblFileList

				 SET @lint_IdxTab   = ISNULL(@lint_IdxTab   ,0) +1
				 
				 ---
				 --- insertar
				 IF NOT EXISTS ( SELECT intFileId  
				                 FROM #tblFileList
								 WHERE intFileId  = @lint_IdFile
								)
					 BEGIN -- NOT EXISTS  = @lint_IdFile
					 
						   INSERT INTO #tblFileList
						   (
						   intIndex ,intFileId ,intFileRefId 
						   ,intFileType , intFilePage ,strFilePath 

						   )
						   VALUES ( 
									 @lint_IdxTab, @lint_IdFile ,@lint_FileRefId 
									  ,@lint_FileType , @lint_FilePageType ,@lstr_FilePath 
								   )
				  
					 END  -- NOT EXISTS  = @lint_IdFile

				 ---
					  FETCH NEXT FROM lfcursor INTO @lint_IdFile ,@lint_FileRefId  ,@lint_FileType, @lint_FilePageType  ,@lstr_FilePath 
				 
			END-- WHILE CURSOR
	           CLOSE lfcursor 
			   DEALLOCATE lfcursor 

	   END --IF (@aintEventId >0)

	
	 
		  -- retornar tabla 
		  SELECT  intIndex   AS 'intIndex'
		         ,intFileId AS 'intFileId'
				 ,intFileRefId AS 'intFileRefId'
				 ,intFileType AS 'intFileType'
				 ,strFilePath AS 'strFilePath'
				 ,strFilePath AS 'strFileName'
				 FROM #tblFileList

			

	END

		 DROP TABLE #tblFileList
				 DROP TABLE #tblFilterDocTypeListsp