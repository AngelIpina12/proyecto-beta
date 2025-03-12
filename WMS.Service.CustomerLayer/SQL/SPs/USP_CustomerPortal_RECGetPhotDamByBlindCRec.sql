--USP_CustomerPortal_RECGetPhotDamByBlindCRec
USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetPhotDamByBlindCRec]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetPhotDamByBlindCRec]
 -- ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetPhotDamByBlindCRec]

(@intBlindCountId INT NULL)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
			 
			 	 -----
    --	crear tabla de resultados 	
	CREATE TABLE #tempRecPhotoDam(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,strPhotoPath varchar(100) NULL
				   ,intBlindCountId int NULL
				   ,intRecShipId INT NULL
				   ,strRECFolio VARCHAR(50) NULL
				   ,intPhotoid INT NULL
				   )
	----------------
	
	
	--insertar tabla de resultados 
		INSERT INTO #tempRecPhotoDam(
										 --Id ,
										strPhotoPath ,intBlindCountId ,intRecShipId 
										,strRECFolio ,intPhotoid 
										)

	-------------------

			 SELECT
			  --	strPhotoPath ,intBlindCountId ,intRecShipId 
			        ph.Path,ph.PhotoRefId, bc.RecTrailerShipmentId
		      -- ,strRECFolio ,intPhotoid 
			     , rts.RECFolio, ph.Id

				 from BlindCounts bc 
				 inner join Photos ph on bc.Id = ph.PhotoRefId
				 inner join RecTrailerShipments rts on rts.Id = bc.RecTrailerShipmentId
				 where bc.Id = @intBlindCountId 
			       and PageType = 12 and PhotoType =2
				 
				 order by ph.Id asc
			   
			select 
			ID  as 'introwID'
			,strPhotoPath  as 'strPhotoPath'
			,intBlindCountId as'intBlindCountId'
			,intRecShipId as 'intRecShipId'
			,strRECFolio as 'strRECFolio'
			,intPhotoid as 'intPhotoid'
				
	       from #tempRecPhotoDam
END				