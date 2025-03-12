USE [cargoquin]
GO
---- 
--SELECT TOP 20 * FROM RecTrailers ORDER BY Id DESC 
DECLARE	@return_value int,
		@res int

DECLARE @newfolio INT
DECLARE @wdocs  [TVP_Documents]
DECLARE @wmatloc [TVP_Ints]
DECLARE @wphotos [TVP_Photos]
declare @dtmToday datetime

declare @intGatePassMAX int 
declare @strToday varchar(22)
SELECT @newfolio = max(Folio) from RecTrailers
SET @newfolio =ISNULL(@newfolio,0)
SET @newfolio  = @newfolio  +1 
set @dtmToday = getdate()
select @strToday = format(getdate(),'yyyyMMdd-HHmm')

select  @intGatePassMAX  = max(RecGPCQFolioDbId) from RecTrailers

DECLARE @lstrTrailer varchar(33)
DECLARE @lstrLicenPl varchar(33)
DECLARE @lstrSeal varchar(33)
DECLARE @lstrTrck varchar(33)
DECLARE @lstrDrivLic varchar(33)
DECLARE @lstrtkfolio varchar(33)

SET @lstrTrailer= 'TRL'+@strToday 
SET @lstrLicenPl = 'LC'+@strToday 
SET @lstrSeal  = 'SL'+@strToday 
SET @lstrTrck  = 'TRK' +@strToday 
set @lstrDrivLic  = 'DLC'+@strToday 
set @lstrtkfolio = 'TKCQ1'+ CONVERT(VARCHAR(7),@newfolio )

SELECT	@res = NULL

EXEC	@return_value = [dbo].[USP_TrailerReceipt_InsertOrUpdate]
		@Id = NULL,
		@Folio = @newfolio ,
		@Trailer =@lstrTrailer,
		@ReceivingStart = NULL,
		@ReceivingEnd = NULL,
		@TransportType = 1, -- trailer
		@LicensePlates = @lstrLicenPl,
		@TransportationLineId = 6,-- TIMSA
		@Seal = @lstrSeal ,
		@DriverId = 7,-- CESAR ADRIAN
		@TrLocationId = 53566, --DOC-3-0-0-0
		@TrStatus = 498,---Loaded In o 492, received at dock
		@ForkLiftDriverId = NULL,
		@AuditorId = NULL,
		@MaterialLocationId = NULL,
		@TotalPallets = 100,
		@TotalBoxes = 100,
		@Dock = NULL,
		@ReceiptType = 1,--manual , el 2 es automatica
		@Observations = NULL,
		@TrailerOrigin = 1, --National
		@WorkAllocationType = NULL,
		@ScanSequence = NULL,
		@IsMultiShipment = NULL,
		@SingleCustomerId = 328,
		@WarehouseCustomerId = 118,--Tecnologia Alterco S.A. de C.V.
		@Documents = @wdocs,
		@MaterialLocationIds = @wmatloc,
		@AddedBy = 3025, ---Users.Id -alopez
		@EventDate =@dtmToday ,
		@WareHouseId = 3, --CQ1 MTY PIRSA A
		@AccessDate = @dtmToday ,
		@RegistrationDate = @dtmToday ,
		@OrgGPStatusIn ='498',--''loaded in 
		@PhotosTaken = NULL,
		@AddedDate = @dtmToday ,
		@ModifiedBy =3025, ---Users.Id -alopez
		@ModifiedDate =@dtmToday ,
		@TruckTransportationLine = '250',
		@ContainerStatus ='Loaded In',
		@TruckNumber =@lstrTrck  ,
		@DriverLiscence = @lstrDrivLic  ,
		@DriverCard = NULL,
		@TrailerAddedFrom =NULL ,
		@GatePassId =@intGatePassMAX  ,
		@Photos = @wphotos,
		@MajorAssignmentDate =@dtmToday ,
		@RecTKFolio = @lstrtkfolio ,
		@MaterialReturnComments = NULL,
		@IsMaterialReturned = 0,
		@IsBulkUnload = 0,
		@IsCrossdock = 0,
		@IsCrossdockScan = 0,
		@res = @res OUTPUT

SELECT	@res as N'@res'

SELECT	'Return Value' = @return_value

GO
