	CREATE PROCEDURE [dbo].[USP_GetFilterTrailerStatus]
	AS
	BEGIN
	       -- ALTER TABLE #tblBaseStatus( intStatId int, strName varchar(50) )

	       CREATE TABLE #tblBaseStatus( intStatId int
		                                , strName varchar(50)
									)
		-- Insert statements for procedure here
			CREATE TABLE #tblFilterStatusTypes(
	               intId int 
	               ,strStatus varchar(50)				   
	            )

		  -- insertar todos los estatus de eventos  agrupados con su id 
		  INSERT INTO #tblBaseStatus( intStatId , strName )
		  SELECT StatusTypes.Id ,StatusTypes.Status
		  FROM StatusTypes
		  WHERE StatusTypes.Id IN ( SELECT EventType 
		                             FROM TrailerEvents
									 GROUP BY EventType
								 )

          -- insertar Received At Yard
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Received At Yard'
				
		  -- insertar Received At Dock
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Received At Dock'
			
		  -- insertar Empty In
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Empty In'
			
		  -- insertar  Loaded
		   INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Loaded'

		  --Closed
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Closed'

		  --Shipped
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Shipped'

		  --Ready To Leave
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Ready To Leave'

		  --Shipment Departured
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Shipment Departured'

		  --Empty Out
		  INSERT INTO  #tblFilterStatusTypes(intId ,strStatus )
		  SELECT #tblBaseStatus.intStatId , #tblBaseStatus.strName 
		  FROM #tblBaseStatus
		  WHERE #tblBaseStatus.strName = 'Empty Out'

		  SELECT intId ,strStatus 
		  FROM #tblFilterStatusTypes
	 

	END
	GO
