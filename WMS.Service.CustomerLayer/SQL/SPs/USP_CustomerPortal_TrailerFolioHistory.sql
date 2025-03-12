USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_TrailerFolioHistory]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
     
  CREATE OR ALTER PROCEDURE  [dbo].[USP_CustomerPortal_TrailerFolioHistory]

(@strFolio varchar(50)
  --@strTRFolio varchar(50) 
 --,@intIsRecep INT =NULL
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

     --DECLARE @aint_UserId int
	DECLARE @lint_WhareHouseId int
	DECLARE @ldtm_StartRange DATETIME --rango para query
	DECLARE @ldtm_Date DATETIME
	DECLARE @intIndex  INT 
	DECLARE @lintISReceipt INT
	DECLARE @lint_IndexSec INT
	DECLARE @ldtmDate DATETIME
	DECLARE @lint_Validate INT
	  DECLARE @lintInventoryId INT
    DECLARE @ldtmValidDate datetime
	DECLARE @lint_IdEvent INT

	DECLARE @lint_eventid INT
	DECLARE @lstr_eventname varchar(50)

	SET @lintISReceipt  =-1 
	SET @ldtmValidDate  = '20010101 00:00'
	------
	
    --	crear tabla de resultados 	
	CREATE TABLE #tblHistoric(
	               intIndex int 
	               ,strFolio varchar(50)
				   ,strEvent varchar(20) NULL
				   ,DtmEventDate  DATETIME NULL
				   ,InSlide INT
				   ,intRecTrailerId INT NULL
				   ,intEventId INT NULL
	            )
      --------
	  
	  

	  --- eventos por tipo en ves el servicio 
	  BEGIN

		   CREATE TABLE #tblStatusEvents(
						 intIndex int
						 ,strEventname varchar(100)
					   )
	       ----
		   -----------
		   --insertar los servicios 
		     INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 1, 'Received At Yard')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 2, 'Received At Dock')
		   		   
			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 3, 'Empty In')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 4, 'Blind Count Started')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 5, 'IOS Import')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 6, 'InProcess (2nd verification)')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 7, 'ReOpen Trailer')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 8, 'Loaded')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 9, 'Closed')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 10, 'Shipping Added')
			 
			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 11, 'Pending Departure InProcess')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 12, 'Ready To Leave')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 13, 'Shipment Departured')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 14, 'Shipped')

			 INSERT INTO  #tblStatusEvents(intIndex ,strEventname )
			 VALUES( 15, 'Empty Out')

			 

	        DECLARE lcursor CURSOR FOR
			SELECT intIndex ,strEventname 
			FROM #tblStatusEvents

			OPEN lcursor 
			 FETCH NEXT FROM lcursor  INTO @lint_eventid ,@lstr_eventname 
			 ---
			 
				WHILE @@FETCH_STATUS = 0  
				BEGIN  
					  	set @ldtmDate  = @ldtmValidDate 
						SET @lint_IdEvent  =0


						SELECT 	@lint_IdEvent = MAX(TrailerEvents.Id) 
						FROM RecTrailers
						INNER JOIN TrailerEvents ON TrailerEvents.RecTrailerDBRefId = RecTrailers.Id
						INNER JOIN  StatusTypes ON StatusTypes.Id = TrailerEvents.EventType
						WHERE RecTrailers.TRFolio= @strFolio
						AND  StatusTypes.Status=@lstr_eventname

						--
						  IF ( @lint_IdEvent >0)
						  BEGIN

							  set @lint_Validate  =0
							  -- validar 
					
							  -- obtener idx
								SELECT @lint_IndexSec = MAX(intIndex)
								FROM  #tblHistoric

								SET @lint_IndexSec = ISNULL(@lint_IndexSec,0)+1	
							  ----
							  -- VALIDO Received At Yard 
									INSERT INTO #tblHistoric
									(intIndex , strFolio ,strEvent
									,DtmEventDate ,InSlide , intRecTrailerId , intEventId )
									SELECT @lint_IndexSec , RecTrailers.TRFolio , @lstr_eventname
										   , TrailerEvents.EventDate, 1, RecTrailers.Id , TrailerEvents.Id
									FROM RecTrailers 
									INNER JOIN TrailerEvents ON TrailerEvents.RecTrailerDBRefId =RecTrailers.Id
									WHERE RecTrailers.TRFolio= @strFolio
									AND TrailerEvents.Id = @lint_IdEvent 
							  --------

						  END  --IF ( @lint_IdEvent >0)
						 -- 
			
					  FETCH NEXT FROM lcursor  INTO @lint_eventid ,@lstr_eventname 
				END 

				CLOSE lcursor  
				DEALLOCATE lcursor  
			 ---
			  --- feb 2025
			  begin
			   -- ver si no tiene ingreso 
			   IF (
			         NOT EXISTS (
			                     SELECT intIndex
								 FROM  #tblHistoric 
								 WHERE strEvent IN (
								                         'Received At Yard'
														 ,'Received At Dock'
														 ,'Empty In'

								                      )
			                   
				              )
					 AND  EXISTS(
					        SELECT RECTS.Id
							FROM RecTrailers RT
							 INNER JOIN RecTrailerShipments RECTS ON RECTS.RecTrailerId = RT.Id
							WHERE RT.TRFolio =@strFolio
					     )
					)
					BEGIN-- inserta ingreso
							     
						-- obtener idx
					SELECT @lint_IndexSec = MAX(intIndex)
					FROM  #tblHistoric

					SET @lint_IndexSec = ISNULL(@lint_IndexSec,0)+1	

					----
						INSERT INTO #tblHistoric
						(intIndex , strFolio ,strEvent
						,DtmEventDate ,InSlide , intRecTrailerId , intEventId )
						SELECT @lint_IndexSec , RT.TRFolio , 'Received'
						,RT.ReceivingStart, 0, RT.Id, 0
						FROM RecTrailers RT
							INNER JOIN RecTrailerShipments RECTS ON RECTS.RecTrailerId = RT.Id
							WHERE RT.TRFolio =@strFolio
					END --- fin ingreso 


			
			 -----------

			   
			   -- ver si no tiene SALIDA
			   --incio salida
				   IF (
			         NOT EXISTS (
			                     SELECT intIndex
								 FROM  #tblHistoric 
								 WHERE strEvent IN (
								                     'Shipping Added'
													,'Pending Departure InProcess'
												    ,'Ready To Leave'
													,'Shipment Departured'
													,'Shipped'
													,'Empty Out'
													)
			                   
				              )
					 AND  EXISTS(
					        SELECT SHIPT.Id
							FROM RecTrailers RT
							 INNER JOIN ShippingTrailers SHIPT ON RT.Id = SHIPT.RecTrailerId							 
							WHERE RT.TRFolio =@strFolio
					     )
					)
					BEGIN-- inserta salida
							     
						-- obtener idx
					SELECT @lint_IndexSec = MAX(intIndex)
					FROM  #tblHistoric

					SET @lint_IndexSec = ISNULL(@lint_IndexSec,0)+1	

					----
						INSERT INTO #tblHistoric
						(intIndex , strFolio ,strEvent
						,DtmEventDate ,InSlide , intRecTrailerId , intEventId )
						SELECT @lint_IndexSec , RT.TRFolio , 'GateOut'
						,convert(datetime, SH.DepartureDate,103) + CAST(SH.DepartureTime as DATETIME), 0, RT.Id, 0						 
							FROM RecTrailers RT
							 INNER JOIN ShippingTrailers SHIPT ON RT.Id = SHIPT.RecTrailerId							 
							 LEFT JOIN Shipments SH ON SH.ShippingTrailerId = SHIPT.Id
							WHERE RT.TRFolio =@strFolio
					    
					END --- fin salida


			
			   -- fin salida 
			   ------------

			  end --- feb 2025
			  
			-- si no hay registros de ingreso 
			IF NOT EXISTS (
			                SELECT strEvent 
							FROM #tblHistoric 
							WHERE strEvent IN (  'Received At Yard'
							                    , 'Received At Dock'
												, 'Empty In'
							                  )
			              )
			  BEGIN
				   -- insertar el in 
			   			SELECT @lint_IndexSec = MAX(intIndex)
						FROM  #tblHistoric

						SET @lint_IndexSec = ISNULL(@lint_IndexSec,0)+1	

						----
							INSERT INTO #tblHistoric
							(intIndex , strFolio ,strEvent
							,DtmEventDate ,InSlide , intRecTrailerId , intEventId )
							SELECT @lint_IndexSec , RT.TRFolio , 'GateIn'
							, RT.ReceivingStart, 0, RT.Id, 0						 
								FROM RecTrailers RT								 
								WHERE RT.TRFolio =@strFolio
					    
			  END --IF NOT EXISTS ()
			  
			 -- ver si tiene foto de ingreso , registrarlo como receiving, siempre no haa
			
		   --------

			SET @ldtm_Date  = NULL
			-- retornar tabla 
			  SELECT  intIndex  AS 'intIndex'
					 ,strFolio AS 'strFolio'
					 ,strEvent AS 'strEvent'
					 ,DtmEventDate AS 'DtmEventDate'
					 ,intRecTrailerId  AS 'intRecTrailerId'
				     ,intEventId AS 'intEventId'

					 FROM #tblHistoric 

			 RETURN 0 

	  END ----- eventos por tipo en ves el servicio  

	END --SP
