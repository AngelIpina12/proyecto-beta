
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetEventImageListPath]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR  ALTER PROCEDURE  [dbo].[USP_CustomerPortal_GetEventImageListPath]

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
	DECLARE @lintImageType int
	------
	
	 DECLARE @lint_IdxTab INT
	 DECLARE @lint_IdPhoto INT
	 DECLARE @lint_PhotoRefId INT
	 DECLARE @lint_PhotoType INT 
	 DECLARE @lstr_PhotoPath varchar(100)

	-------
	
    --	crear tabla de resultados 	
	CREATE TABLE #tblImageList(
	               intIndex int 
				   ,intPhotoId int NULL
				   ,intPhotoRefId INT NULL
				   ,intPhotoType INT NULL 
				   ,intPhotoPage INT NULL
				   ,strPhotoPath varchar(100) NULL
	            )

	CREATE TABLE #tblFilterPhotoTypeList(
	                intType int
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

		--select @lstrEventname as 'lstrEventname'  
		--  , @lintEventType  as 'lintEventType'
		 -- , @lintTrailerId as 'lintTrailerId'
		 -- , @lintShipTrailerId  as 'lintShipTrailerId'
		 -- ,@aintEventId		as 'aintEventId'


		---	   SELECT TOP 200 *
		--   FROM TrailerEvents
		--   WHERE EventType IN (
	   -- SELECT Id
	    --FROM   StatusTypes
	   --WHERE StatusTypes.Status IN (
	   --		      'Received At Yard', 'Received At Dock'
	   --	   		   , 'Empty In', 'Blind Count Started'
       --           , 'IOS Import', 'InProcess (2nd verification)'
	   --			  , 'ReOpen Trailer', 'Loaded', 'Closed', 'Shipping Added'
       --          , 'Pending Departure InProcess', 'Ready To Leave'
	   --			 , 'Shipment Departured', 'Shipped', 'Empty Out'
		--		 )
		--)

		 SET @lintImageType =0

         -- condicionante de tipo de imagen
		           
		 --'Received At Yard',
		 IF ( @lstrEventname = 'Received At Yard')
		 BEGIN
		   -- PhotoType_Receiving = 1;
		   SET @lintImageType =1
		   --
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	       VALUES (1)
			--
			--
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (11) --PhotoType_ReceivingInspection = 11;}
			--

			--
			----PhotoType = 8 /*Gatepass in
			INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (8) 
			
			---
		 END 

		 --'Received At Dock'
		 IF ( @lstrEventname = 'Received At Dock')
		 BEGIN
		 --  PhotoType_Receiving = 1;
		   SET @lintImageType =1
		   --
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (1)
			--
			--
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (11) --PhotoType_ReceivingInspection = 11;}
			--
			
			----PhotoType = 8 /*Gatepass in
			INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (8) 
		 END 
		 --
		 --'Empty In'
		 IF ( @lstrEventname = 'Empty In')
		 BEGIN
		 --  PhotoType_Receiving = 1;
		   SET @lintImageType =1
		   --
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (1)
			--
			--
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (11) --PhotoType_ReceivingInspection = 11;}
			--
			
			----PhotoType = 8 /*Gatepass in
			INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (8) 
		 END 


		 -- 'Blind Count Started'
		 IF ( @lstrEventname = 'Blind Count Started')
		 BEGIN
		 --PhotoType =  2/*Blind count -- Damaged*/,
		   SET @lintImageType =2
		   --
		   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (2) --Blind count 
			---- PhotoType = 11 -- UnloadingTrailerReceiving photos , Receiving inspector
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (11) --Receiving inspector
		 END 


	
		 ---------
		 -- 'IOS Import'
		 -- 'InProcess (2nd verification)'
		 -- 'ReOpen Trailer'

		 --, 'Loaded'
		 IF ( @lstrEventname = 'Loaded')
		 BEGIN
		 -- PhotoType = 10 --Loading Trailer --10 /*LoadingTrailerPhotos
		   SET @lintImageType =10
		   
			-- PhotoType = 10 --Loading Trailer --10 /*LoadingTrailerPhotos
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (10) --Receiving inspector

		 END 


		 --, 'Closed',
		 --'Shipping Added'
		  IF ( @lstrEventname = 'Shipping Added')
		 BEGIN
		 --PhotoType = 9 ---Shipping , GatePassout 
		   SET @lintImageType =9
		   
			--PhotoType = 9 ---Shipping , GatePassout 
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (9)  ---Shipping 

		 END 
          -- 'Pending Departure InProcess'

		  -- 'Ready To Leave'
		  --PhotoType = 9 ---Shipping , GatePassout 
		   IF ( @lstrEventname = 'Ready To Leave')
		 BEGIN
		 --PhotoType = 9 ---Shipping , GatePassout 
		   SET @lintImageType =9
		   
			--PhotoType = 9 ---Shipping , GatePassout 
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (9)  ---Shipping 

		 END 


		  -- 'Shipment Departured'
		  --PhotoType = 9 ---Shipping , GatePassout 
		 IF ( @lstrEventname = 'Shipment Departured')
		 BEGIN
		 --PhotoType = 9 ---Shipping , GatePassout 
		   SET @lintImageType =9
		   
			--PhotoType = 9 ---Shipping , GatePassout 
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (9)  ---Shipping 

		 END 



		  -- 'Shipped'
	     --PhotoType = 4 --Packing slip ,  shiping
		  IF ( @lstrEventname = 'Shipped')
		 BEGIN
		  --PhotoType = 4 --Packing slip ,  shiping
		   SET @lintImageType =4
		   
			 --PhotoType = 4 --Packing slip ,  shiping
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (4)  ---Shipping 

		 END 



		  -- 'Empty Out'
		  --PhotoType = 9 ---Shipping , GatePassout 
		 --
		 	 IF ( @lstrEventname ='Empty Out')
		 BEGIN
		 --PhotoType = 9 ---Shipping , GatePassout 
		   SET @lintImageType =9
		   
			--PhotoType = 9 ---Shipping , GatePassout 
			   INSERT INTO #tblFilterPhotoTypeList(intType)
	        VALUES (9)  ---Shipping 

		 END 

		 
	   END --IF (@aintEventId >0)
		 --
	
	
		-- si no tiene registros , y el evento es   ,@astrEventName v'Received'
		 IF (@aintEventId =0)
		 begin

			 set @lintTrailerId = @aintTrailerId
			 IF (
				   ( SELECT  COUNT(intType)
					 FROM #tblFilterPhotoTypeList) =0
				   AND 
				   (@astrEventName ='Received')	
				)
				BEGIN
			   
			      IF NOT EXISTS (
				                 SELECT intType
								 FROM #tblFilterPhotoTypeList
								 WHERE intType =8
				                 )
								 BEGIN
									 ----PhotoType = 8 /*Gatepass in
									 INSERT INTO #tblFilterPhotoTypeList(intType)
									 VALUES (8) 
								 END --IF NOT EXISTS (
					
				END --SELECT  COUNT(intType) =0

				-- si no tiene registros , y el evento es   ,@astrEventName v'Received'
			 IF (		     
				   (@astrEventName ='GateOut')	
				   and
				   ( SELECT  COUNT(intType)
					 FROM #tblFilterPhotoTypeList) =0
				)
				BEGIN
				        
					  IF NOT EXISTS (
									 SELECT intType
									 FROM #tblFilterPhotoTypeList
									 WHERE intType =9
									 )
									 BEGIN
										  ----PhotoType =9
										  INSERT INTO #tblFilterPhotoTypeList(intType)
										  VALUES (9) 	
									 END  -- NOTS EXISTS 
								
				END  --COUNT =0

				---receiving
				----PhotoType =9
		 
		 --- si hay evento de ingreso 
		 IF (  @astrEventName ='GateIn')
		 BEGIN
		 	  IF NOT EXISTS ( SELECT intType
			                  FROM #tblFilterPhotoTypeList
							  WHERE intType =8
							)
							 BEGIN
										  ----PhotoType =8
										  INSERT INTO #tblFilterPhotoTypeList(intType)
										  VALUES (8) 	
							 END  -- NOTS EXISTS 

			  
			  --
			  IF NOT EXISTS ( SELECT intType
			                  FROM #tblFilterPhotoTypeList
							  WHERE intType =1
							)
							 BEGIN
									  ----PhotoType =1
										  INSERT INTO #tblFilterPhotoTypeList(intType)
										  VALUES (1) 	
							 END  -- NOTS EXISTS 
							 
		  END 
          
		 end --IF (@aintEventId =0)



		  -- CURSOR PARA OBTENER LAS FOTOS POR FOLIO POR EL TIPO
		  DECLARE lfcursor CURSOR FOR
		  SELECT Photos.Id  , Photos.PhotoRefId ,Photos.PhotoType , Photos.Path
		  FROM Photos 
		   INNER JOIN #tblFilterPhotoTypeList TTYPE ON TTYPE.intType =Photos.PhotoType
		  WHERE Photos.PhotoRefId =  @lintTrailerId
		  AND TTYPE.intType =Photos.PhotoType

		  OPEN lfcursor
		  FETCH NEXT FROM lfcursor INTO @lint_IdPhoto ,@lint_PhotoRefId ,@lint_PhotoType ,@lstr_PhotoPath 

		    WHILE @@FETCH_STATUS =0
			BEGIN

			     SET @lint_IdxTab =0

				 -- obtener el id maximo de la tabla 
				 SELECT @lint_IdxTab   = MAX(#tblImageList.intIndex)
				 FROM #tblImageList

				 SET @lint_IdxTab   = ISNULL(@lint_IdxTab   ,0) +1
				 
				 ---
				 --- insertar
				   INSERT INTO #tblImageList
				   (
				   intIndex ,intPhotoId ,intPhotoRefId 
				   ,intPhotoType ,strPhotoPath 
				   )
				   VALUES ( 
				             @lint_IdxTab   ,@lint_IdPhoto  ,@lint_PhotoRefId 
							  ,@lint_PhotoType ,@lstr_PhotoPath 
				           )
				  
				 ---
				 FETCH NEXT FROM lfcursor INTO @lint_IdPhoto ,@lint_PhotoRefId ,@lint_PhotoType ,@lstr_PhotoPath 
				 
			END-- WHILE CURSOR
	


	
	 
		  -- retornar tabla 
		  SELECT  intIndex   AS 'intIndex'
		         ,intPhotoId AS 'intPhotoId'
				 ,intPhotoRefId AS 'intPhotoRefId'
				 ,intPhotoType AS 'intPhotoType'
				 ,strPhotoPath AS 'strPhotoPath'
				 FROM #tblImageList

	END