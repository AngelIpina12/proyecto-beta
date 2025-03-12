USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_RECGetCATCustomerByname]     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_RECGetCATCustomerByname]
--ALTER PROCEDURE [dbo].[USP_CustomerPortal_RECGetCATCustomerByname]

(@strCustomerName varchar(50) -- Folio #
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

	 -----
	  --. MAYUSCULAS
	  SET @strCustomerName  = UPPER(@strCustomerName )
	 ---
    --	crear tabla de resultados 	
	CREATE TABLE #tempCustomerList(
	               ID int IDENTITY(1,1) PRIMARY KEY
				   ,intCustomerId INT NULL
				   ,strCustomerName varchar(200) NULL
				   )
	----------------
	
			 --insertar tabla de resultados 
		INSERT INTO #tempCustomerList(intCustomerId , strCustomerName  )

	-------------------
	 SELECT TOP 100 CS.Id , CS.Name
	 FROM Customers CS
	 WHERE CS.IsActive =1	 
	 AND ( 
	     UPPER( CS.Name )LIKE '%'+ @strCustomerName +'%'
		  OR CS.Name  = ISNULL( @strCustomerName ,CS.Name )
	     )

	


	 SELECT intCustomerId  AS 'intCustomerId'
	       ,strCustomerName AS 'strCustomerName'
	 FROM #tempCustomerList 
	 ORDER BY strCustomerName  ASC 

		 RETURN 0

	 
	 END -- BEGIN
	 --RETURN 0 
			