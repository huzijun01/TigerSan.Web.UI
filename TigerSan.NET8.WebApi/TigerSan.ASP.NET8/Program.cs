using TigerSan.NET8.WebApi.Helpers;
using TigerSan.NET8.WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container:
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add custom services:
builder.AddFilters();
builder.Services.AddDbContext();
builder.Services.RegisterServices();

// Create app:
var app = builder.Build();
SettingHelper.Init(app.Configuration);

// Configure the HTTP request pipeline:
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
