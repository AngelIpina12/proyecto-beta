using WMS.Service.CustomerLayer.Business.Filter.Cats;
using WMS.Service.CustomerLayer.Business.Filter.Inv;
using WMS.Service.CustomerLayer.Business.Objects.Cat;
using WMS.Service.CustomerLayer.Business.Objects.Inv;
using WMS.Service.CustomerLayer.DAL;

namespace WMS.Service.CustomerLayer.Business.Interfaces
{
    public interface ICatalogManager
    {
        ICatalogManager CatalogManager { get; set; }
        IUnitOfWork UnitOfWork { get; set; }
        IDynamicRepository DynamicRepository { get; set; }
        public List<ProductSKU> GetProductSKUCustom(SearchCatProdBySKU aFilter);
        public List<EndCustomerVS> GetEndCustomer(SearchCatEndCustomer aFilter);
        public List<SupplierVS> GetSupplier(SearchCatSupplier aFilter);

        public List<SuppSKURS> GetSupplierSKU(SearchCatSuppSKU aFilter);

    }
}
