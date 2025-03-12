--USE [cargoquin]
GO

/****** Object:  Table [dbo].[CustomerModules]    Script Date: 10/01/2025 10:23:57 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CustomerModules](
	[intModuleId] [int] NOT NULL,
	[strModuleName] [nvarchar](20) NULL,
	[strModuleDesciption] [nvarchar](50) NULL,
 CONSTRAINT [PK_CustomerModules] PRIMARY KEY CLUSTERED 
(
	[intModuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


--USE [cargoquin]
GO

INSERT INTO [dbo].[CustomerModules]
           ([intModuleId]
           ,[strModuleName]
           ,[strModuleDesciption])
     VALUES
           (1
           ,'Yard Management'
           ,'Yard Management')
GO


INSERT INTO [dbo].[CustomerModules]
           ([intModuleId]
           ,[strModuleName]
           ,[strModuleDesciption])
     VALUES
           (2
           ,'Inventory'
           ,'Inventory')
GO

GO


INSERT INTO [dbo].[CustomerModules]
           ([intModuleId]
           ,[strModuleName]
           ,[strModuleDesciption])
     VALUES
           (3
           ,'Shipping'
           ,'Shipping')
GO
GO


INSERT INTO [dbo].[CustomerModules]
           ([intModuleId]
           ,[strModuleName]
           ,[strModuleDesciption])
     VALUES
           (4
           ,'Requirement'
           ,'Requirement')
GO