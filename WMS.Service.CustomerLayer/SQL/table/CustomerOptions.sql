CREATE TABLE [CustomerOptions](
	[intOptionId] [int] IDENTITY(1,1) NOT NULL,
	[intModuleId] [int] NOT NULL,
	[intUserId] [int] NOT NULL,
	[strTitle] [nvarchar](100) NULL,
	[strLegend] [nvarchar](100) NULL,
	[strUrl] [nvarchar](300) NULL,
	[strCreatedBy] [nvarchar](50) NULL,
	[dtmCreated] [datetime] NULL,
	[strLastmodifiedBy] [nvarchar](50) NULL,
	[dtmLastModfied] [datetime] NULL,
 CONSTRAINT [PK_CustomerOptions] PRIMARY KEY CLUSTERED 
(
	[intOptionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO