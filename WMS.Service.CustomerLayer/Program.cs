using WMS.Service.CustomerLayer.Business.Interfaces;
using WMS.Service.CustomerLayer.Business.Managers;
using WMS.Service.CustomerLayer.DAL;
using WMS.Service.CustomerLayer.Middlewares.JWT;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddHttpClient();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//conexiones
builder.Services.AddTransient<ConnectionFactory>();
builder.Services.AddScoped<IConnectionFactory, ConnectionFactory>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// mangers
builder.Services.AddScoped<IManager, Manager>();
builder.Services.AddScoped<IYardManager, YardManager>();
builder.Services.AddScoped<IUserManager, UserManager>();
builder.Services.AddScoped<IReceiveManager, ReceiveManager>();
builder.Services.AddScoped<IDashboardManager, DashboardManager>();
builder.Services.AddScoped<IReqManager , ReqManager>();
builder.Services.AddScoped<IInvManager, InvManager>();
builder.Services.AddScoped<IShipManager, ShipManager>();
builder.Services.AddScoped<ICatalogManager,CatalogManager>();
builder.Services.AddScoped<IKPIManager, KPIManager>();


// respository
builder.Services.AddScoped<IReqManager, ReqManager>();
builder.Services.AddTransient(typeof(IRepository<>), typeof(RepositoryBase<>));
builder.Services.AddScoped<IDynamicRepository, DynamicRepositoryBase>();


builder.Services.AddJwt(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy => policy
            .AllowAnyOrigin()   // Permite solicitudes de cualquier origen
            .AllowAnyMethod()   // Permite cualquier método HTTP
            .AllowAnyHeader()); // Permite cualquier encabezado
});

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAllOrigins");

app.MapFallbackToFile("index.html");

await app.RunAsync();
