--USP_CustomerPortal_RECGetPackingPathLByBlindC
USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetPackingPathLByBlindC]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetPackingPathLByBlindC]
--  ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetPackingPathLByBlindC]
(@intBlindCountId INT NULL)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
			 
			 	 -----
    --	crear tabla de resultados 	
CREATE TABLE #tblFileList(
	                ID int IDENTITY(1,1) PRIMARY KEY
					,intDocId INT NULL
				   ,intFileRefId INT NULL
				   ,strFilename varchar(100) NULL
				   ,intFileType INT NULL 
				   ,intFilePage INT NULL
				   ,strFilePath varchar(100) NULL
	            )

		------
		INSERT INTO #tblFileList (intDocId ,intFileRefId ,strFilename 
								 ,intFileType ,intFilePage ,strFilePath 
								  )
					   --
		 SELECT 
					   --intDocId ,intFileRefId ,strFilename 
					   doc.Id, doc.DocRefId , doc.Path
					   -- ,intFileType ,intFilePage ,strFilePath 
					   ,doc.DocType , doc.PageType ,doc.Path

		 FROM BlindCounts bc
		 inner join Documents doc on doc.DocRefId  = bc.InventoryId
		 where bc.Id =@intBlindCountId 
		 and doc.DocType  =1
					   -------



				 --
		SELECT
		         ID AS 'introwid'
				, intDocId AS 'intDocId'
				,intFileRefId AS 'intFileRefId'
				,strFilename AS 'strFilename'
	            ,intFileType AS 'intFileType'
				,intFilePage AS 'intFilePage'
				,strFilePath AS 'strFilePath'
		FROM #tblFileList

end	
	----------------
	
	
