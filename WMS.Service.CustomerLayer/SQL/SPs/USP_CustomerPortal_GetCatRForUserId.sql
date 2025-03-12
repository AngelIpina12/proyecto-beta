USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_CustomerPortal_GetCatRForUserId     ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_CustomerPortal_GetCatRForUserId]
  --ALTER PROCEDURE [dbo].USP_CustomerPortal_GetCatRForUserId]

(@UserId INT
 ,@strType varchar(20) NULL
 ,@intAtype INT NULL
)
AS
BEGIN 
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

 END  --begin
