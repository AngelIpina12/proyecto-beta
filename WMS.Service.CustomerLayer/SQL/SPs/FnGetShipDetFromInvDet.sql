CREATE FUNCTION dbo.FnGetShipDetFromInvDet(@aintInvDet INT)
RETURNS INT
AS
BEGIN
    DECLARE @lint_ret INT 

	SET @lint_ret =0

	SELECT @lint_ret  =MAX(shd.Id )
	FROM ShipmentDetails shd
	WHERE shd.InventoryDetailId = @aintInvDet 

	SET @lint_ret = ISNULL(@lint_ret,0)
    RETURN @lint_ret ;
END
