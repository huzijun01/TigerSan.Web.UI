using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Extensions;
using TigerSan.NET8.WebApi.Interfaces.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container:
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add custom services:
builder.AddFilters();
builder.Services.AddDbContext();
builder.Services.RegisterServices();
builder.Services.AddAllowAllCors();

// Create app:
var app = builder.Build();
SettingHelper.Init(app.Configuration);

// Configure the HTTP request pipeline:
app.UseAllowAllCors();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 每日盘点：
var inventoryRecordService = app.Services.CreateScope().ServiceProvider.GetRequiredService<IInventoryRecordService>();
inventoryRecordService.StartInventory();
// SSE监听：
SseInstance.InitInstance(app.Services).Start();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run(SettingHelper.AppSettings.ListenUrl);