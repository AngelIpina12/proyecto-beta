USE [cargoquin]
GO
/****** Object:  StoredProcedure [dbo].[USP_FolioTrailers_Search_GatePass]    Script Date: 29/05/2024 01:21:09 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[USP_FolioTrailers_Search_GatePass] (
                                        @TransportationLine int = null,
									    @FromDate datetime = null,
									    @ToDate datetime = null, 
										@Status int = null,
                                        @ResultCount int = null,
									    @TrailerIds [dbo].[TVP_Ints] READONLY,                                       
										 @WhRes [TVP_WHRestrictions] Readonly
                                        )
as
begin
     SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED	  

    declare @idsCount int
   select @idsCount = count(1) from @TrailerIds

      select distinct top(@ResultCount) rt.Id, st.Id[ShippingTrailerDBRefId], rt.Folio, rt.TRFolio[TRFolio], ISNULL(st.Trailer, rt.Trailer)[TrailerNumber], rt.MajorAssignmentDate,
      rt.ShipmentPhotosTaken, /* here ShipmentPhotosTaken checking in departure time */
	  tl.Name[TransportationLine],tp.TransportationType[TruckTransportationLine],
      case when st.Id is null then ISNULL(rt.SHPTKFolio, rt.RecTKFolio) else case when st.GPCQFolioId is not null then ISNULL(rt.SHPTKFolio, rt.RecTKFolio) else '' end end [ShpTKFolio],
       case when st.Id is null and rt.ExitGatePassDate is not null then ISNULL(rt.SHPTKFolio, rt.RecTKFolio) else case when st.GPCQFolioId is not null then ISNULL(rt.SHPTKFolio, rt.RecTKFolio) else '' end end [QRScan],
       case when st.Id is null then ISNULL(rt.ExitSealNumber, rt.Seal) else case when st.GPCQFolioId is not null then ISNULL(rt.ExitSealNumber, rt.Seal) else '' end end [Seal],
     
     

      case when rt.TrStatus = 429/* Ready To Leave */ then 'P - Pending Departure' else  isnull(stloc.LocationName, LOC.LocationName) end[TrailerLocation], w.Id[WareHouseId], w.Warehouse[WareHouseName], loc.Id[TrLocationId], 
      ISNULL(stloc.LocationTypeId, loc.LocationTypeId)[LocationTypeId],
      isnull(st.GPCQFolioId, ISNULL(rt.ShippingGPCQFolioDbId, rt.RecGPCQFolioDbId))[GatePassId],
       isnull(st.Tractor, rt.TruckNumber)[TruckNumber], rt.ExitGatePassDate, 
      rt.ExitSealNumber, AccessDateTime[AccessDate],
      rt.RecGPCQFolioDbId[RecGPCQFolioDbId], rt.ShippingGPCQFolioDbId[ShippingGPCQFolioDbId],
       rt.OrgGPStatusIn[CheckStatus], rt.TrailerAddedFrom,
      orgstsin.Status[OrgGPStatusIn], orgstsout.Status[OrgGPStatusOut], rt.IsTruckSeperate[IsTruckSeparate], cust.Name[CustomerName], whcust.CustomerName[CQCustomerName],

                ISNULL(MajorAssignmentDate, RegistrationDateTime)[RegistrationDate], /* change here */
               case when st.Id is null then PhotosTaken else  ShipmentPhotosTaken end [PhotosTaken], /* change here */
              
               case when st.StatusId is null then 
                                 /*Receiving Trailer Status */
                              case when rt.TrStatus = 491 then 'Received At Yard' 
                                   when rt.TrStatus = 492 then 'Received At Dock'
                                   when rt.TrStatus = 493 then 'Preparing Unload'
                                   when rt.TrStatus = 494 then 'Unload Started'
                                   when rt.TrStatus = 495 then 'Unload Completed'
                                   when rt.TrStatus = 496 then 'Blind Count Started'
                                   when rt.TrStatus = 497 then 'Close Trailer'
                                 --when rt.TrStatus = 498 then 'Loaded In'
                                   when rt.TrStatus = 499 then 'Empty In'
                                 --when rt.TrStatus = 500 then 'Loaded Out'
                                   when rt.TrStatus = 501 then 'Empty Out'
                                   when rt.TrStatus = 430 then 'Ready To Load'
                                    when rt.TrStatus = 429 then 'Ready To Leave'  /* 429 - Ready To Leave */ 
                                 --  when rt.TrStatus = 429 then 'Ready To Leave'  /* 429 - Ready To Leave */ 
                                  when rt.TrStatus = 431 then 'Shipment Departured'  
                                    end
 
                    when st.StatusId is not null then 
    
                                     /*Shipping Trailer Status */
                               case when st.StatusId = 421 then 'Shipping Dock Assigned' 
                                     when st.StatusId = 422 then '2nd verification In process' 
                                     when st.StatusId = 423 then '2nd verification Completed' 
                                     when st.StatusId = 424 then 'Loading In process' 
                                     when st.StatusId = 425 then 'Loaded' 
                                     when st.StatusId = 426 then 'Pending Departure in Process' 
                                     when st.StatusId = 427 then 'Packing Slip Ready'   -- Shipped
                                      when st.StatusId = 428 then (select st.Status from Rectrailers rec
	                                                                 inner join Statustypes st on st.Id = rec.TrStatus where rec.Id =rt.Id) 
                                       when st.StatusId = 429 then 'Ready To Leave'  /* 429 - Ready To Leave */ 
                                       when st.StatusId = 430 then 'Ready To Load'
                                       when st.StatusId = 431 then 'Shipment Departured'
									   
  end  
  end as [TrStatus],

                             coalesce((
	                    			SELECT STUFF((
	                    					SELECT ',' + (Path + '##'+ cast( d.UniqueId as nvarchar(Max)))
	                    					FROM Documents d
                                           
	                    					WHERE DocRefId = rt.Id and pagetype in(2)
	                    					FOR XML PATH('')
	                    					), 1, 1, '')
	                    		),'') AS UploadedDocuments,
								

                  --            case when st.Id is null then 
                               
                  --                        coalesce((
        		        --                	SELECT STUFF((
        		        --                				SELECT ',' + Path
        		        --                				      from (
				              --          							SELECT  P.Path +'##'+  CAST(ISNULL(P.PhotoType, 0) AS nvarchar(50)) [Path]
				              --          							FROM Photos p                               
				              --          							WHERE PhotoRefId = rt.Id and p.PhotoType in (1/*Unload,Receiving*/,8/*GatePass*/) and  P.PageType in (11,1)
				              --          							--Union All    
				              --          							--select   P.Path +'##'+  CAST(ISNULL(P.PhotoType, 0) AS nvarchar(50)) [Path] from RecTrailerShipments rts
				              --          							--inner  join BlindCounts bc on rts.Id = bc.RecTrailerShipmentId
				              --          							--inner join Photos P on P.PhotoRefId = bc.Id and P.PageType in (11,12)
				              --          							--where rts.RecTrailerId = rt.Id
																	 --union all
																  --  SELECT   P.Path +'##'+  CAST(ISNULL(P.PhotoType, 0) AS nvarchar(50)) [Path]
        										--						FROM Photos p
																	 --  inner join RecTrailerShipments rts1 on rts1.RecTrailerId =  rt.Id/**/
				          				--							   inner join BlindCounts bc1 on bc1.RecTrailerShipmentId= rts1.Id and bc1.Id =p.PhotoRefId and P.PageType in (12)
																	 --  where phototype=2 and rts1.RecTrailerId =  rt.Id 
				              --          					)P 
        		        --                				FOR XML PATH('')
        		        --                				), 1, 1, '')
        		        --                	),'')  

                  --                  else

                  --                    coalesce((
        		        --                	SELECT STUFF((
        		        --                				SELECT ',' + Path
        		        --                				      from (
				              --          							SELECT  P.Path +'##'+  CAST(ISNULL(P.PhotoType, 0) AS nvarchar(50)) [Path]
				              --          							FROM Photos p                               
				              --          							WHERE PhotoRefId = st.Id and p.PhotoType in(4 /* Packing slip */, 9 /*Shipping*/,10/*Loading Trailer*/)				                        							 
				              --          					)P 
        		        --                				FOR XML PATH('')
        		        --                				), 1, 1, '')
        		        --                	),'') 
                                   
                  --           ENd as [UploadedPhotos]
				  photo1.upPhotos[UploadedPhotos], rt.Istbiworkorder[IsMaterialReturned], rt.trStatus[ScanSequence]/*ForTBIWO*/

                     from RecTrailers rt
                     left join ShippingTrailers st on st.RecTrailerId = rt.Id 
                     left join Locations stloc on  stloc.Id  =  st.DockLocationId 
                     left join @TrailerIds tids on rt.Id = tids.Id
					 inner join Locations loc on  loc.Id = rt.TrLocationId
                     inner join Warehouses w on w.Id = rt.WarehouseId  
					 inner join Customers cust on cust.Id = rt.SingleCustomerId
					 inner join WarehouseCustomers whcust on whcust.Id = rt.WarehouseCustomerId
                     inner join @WhRes whIds on whIds.Id = rt.WarehouseId and whIds.Type= 3 
					 inner join Transportations tp on tp.Id = rt.TransportType
					 Left join TransportationLines tl on ISNull(st.TransportationLineId, rt.TransportationLineId) =  tl.Id 
                     --Left join TransportationLines tl on rt.TransportationLineId = tl.Id  
                     --Left join TransportationLines stl on st.TransportationLineId = stl.Id  
                     inner join StatusTypes sts on sts.Id = rt.RecTrStatus
                     left join StatusTypes orgstsin on orgstsin.Id = rt.OrgGPStatusIn
                     left join StatusTypes orgstsout on orgstsout.Id = rt.OrgGPStatusOut
					  outer apply(
					  --coalesce((
        			     SELECT STUFF((
			          select ','+ p1.Path from(
						SELECT  ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path
        						FROM Photos p
								inner join RecTrailers rt1 on rt1.Id=p.PhotoRefId  where  phototype in (1,8) and rt1.Id=  rt.Id and p.PageType in (1,11,8)
                                  and rt1.ExitGatepassDate is null
							 	 union all
                               SELECT   ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path
        						FROM Photos p
			                   inner join RecTrailerShipments rts1 on rts1.RecTrailerId = rt.Id/**/
				          	   inner join BlindCounts btc on btc.RecTrailerShipmentId= rts1.Id and btc.Id =p.PhotoRefId/**/ where phototype=2 and p.PageType in (12) and rts1.RecTrailerId =  rt.Id 

							   	 union all
                               SELECT ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path
        						FROM Photos p
			                   inner join RecTrailerShipments rts1 on rts1.RecTrailerId = rt.Id and rts1.Id =p.PhotoRefId/**/ where phototype=2 and p.PageType in (12) and rts1.RecTrailerId =  rt.Id  

							   	 union all
                             SELECT   ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path
        						FROM Photos p
			                   inner join RecTrailerShipments rts1 on rts1.RecTrailerId = rt.Id/**/
				          	   inner join RecTrailerTobeIdentifiedSkus rectbId on rectbId.RecTrailerShipmentId= rts1.Id and rectbId.Id =p.PhotoRefId/**/ where phototype= 3 and p.PageType in (12) and rts1.RecTrailerId =  rt.Id 
							     union all
                            SELECT  ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path
        						FROM Photos p
				        	inner join ShipmentLoadingDetails sld1 on sld1.Id = p.PhotoRefId  where phototype=10 and p.PageType in (10)   and sld1.ShippingTrailerId = st.Id  

								union all
                          SELECT   ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path
        						FROM Photos p
								 left join ShippingTrailers shp1 on shp1.Id  =p.PhotoRefId where  phototype in(4)  and p.PageType in (4) and shp1.RecTrailerId =  rt.Id
								
								union all
        					  SELECT   ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path	FROM Photos p
								inner join RecTrailers rt1 on rt1.Id=p.PhotoRefId  where  phototype in (9) and rt1.Id=  rt.Id and p.PageType in (9)
							  
							     union all
        					  SELECT   ( Path + '##'+ cast( p.UniqueId as nvarchar(Max)))Path	FROM Photos p
								inner join RecTrailers rt1 on rt1.Id=p.PhotoRefId  where  phototype in (11) and rt1.Id=  rt.Id and p.PageType in (14)
						
							)  p1                   
        						
							FOR XML PATH('')
        					), 1, 1, '') as upPhotos
					 )photo1
					 where
                     rt.WarehouseId =  whIds.Id and (st.Id is null or st.statusid <> 431) and rt.TrStatus <> 431 
                    and ((st.Id is null  and rt.TrStatus = case when isnull(@Status, 0) = 0 then rt.TrStatus else @Status end) or 
					   (st.Id is not null and st.StatusId = case when isnull(@Status, 0) = 0  then st.StatusId else @Status end))
					  and 
					       rt.Id = case when @idsCount = 0 then rt.Id else tids.Id end and
						   isnull(rt.ReceivingStart, '') between @FromDate and @ToDate and
						   isnull(tl.Id, '') = case when @TransportationLine = 0 or @TransportationLine is null then isnull(tl.Id, '') else @TransportationLine end 
						   
						order by rt.MajorAssignmentDate desc,  rt.Id desc 
END 

Print 'End: [dbo].[USP_FolioTrailers_Search_GatePass]'
