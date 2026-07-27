# RESTful接口规范

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 数量 | \[controller\]/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 单条 | \[controller\]/{id} | Get |   | MyActionResult\<TEntity> |
| 集合 | \[controller\]/List | Post | _集合查询参数_ | MyActionResult\<List\<TEntity>> |
| 增单条 | \[controller\] | Post | \[FromBody\] TEntity entity | MyActionResult\<TEntity> |
| 增多条 | \[controller\]/Range | Post | \[FromBody\] List\<TEntity> entities | MyActionResult\<object> |
| 改单条 | \[controller\] | Put | \[FromBody\] TEntity entity | MyActionResult\<object> |
| 改多条 | \[controller\]/Range | Put | \[FromBody\] List\<TEntity> entities | MyActionResult\<object> |
| 删单条 | \[controller\]/{id} | Delete |   | MyActionResult\<object> |
| 删多条 | \[controller\]/Range | Delete | \[FromBody\] List\<TEntity> entities | MyActionResult\<object> |

### 集合查询参数

```cs
int? pageSize, // 页大小
int? pageNumber, // 页号
string? sort, // 排序属性名
bool? ascending, // 是否正序
[FromBody] FilterDto? filter // 筛选器对象
```

# Model

## MyActionResult - 统一返回结果

```cs
public class MyActionResult<TData>
{
    /// <summary>结果码</summary>
    public ActionResultCode Code { get; set; } = ActionResultCode.Success;
    /// <summary>信息</summary>
    public string Message { get; set; } = string.Empty;
    /// <summary>数据</summary>
    public TData? Data { get; set; }
}
```

## FilterDto - 筛选器对象

```cs
#region 过滤器
/// <summary>过滤器</summary>
public class FilterDto
{
    /// <summary>父表</summary>
    public ParentFilter? Parent { get; set; }
    /// <summary>“过滤器”集合</summary>
    public List<PropFilter>? Filters { get; set; }
}
#endregion

#region “属性”过滤器
/// <summary>“属性”过滤器</summary>
public class PropFilter
{
    /// <summary>属性名</summary>
    public string PropName { get; set; } = string.Empty;
    /// <summary>值</summary>
    public object? Value { get; set; }
    /// <summary>值集合</summary>
    public List<object>? Values { get; set; }
}
#endregion

#region “父表”过滤器
/// <summary>“父表”过滤器</summary>
public class ParentFilter
{
    /// <summary>ID</summary>
    public long? Id { get; set; }
    /// <summary>ID集合</summary>
    public List<long>? Ids { get; set; }
    /// <summary>父表</summary>
    public ParentFilter? Parent { get; set; }
}
#endregion
```

## IdName - ID名称对

```cs
public class IdName
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
```

# API

## 用户

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 修改密码 | User/Password | Put | PasswordEdit edit | MyActionResult |
| 登录 | User/Login | Get | string id, string captcha, string search, string password | MyActionResult\<UserInfo> |
| Token登录 | User/LoginByToken | Get | string token | MyActionResult\<UserInfo> |
| 登出 | User/Logout | Get | string username | MyActionResult |
| 获取验证码 | User/Captcha | Post |   | MyActionResult\<CaptchaData> |

### Model

```cs
public class PersonEntity
{
    public long Id { get; set; }
    public long Role { get; set; }
    public bool IsAdmin { get; set; } = false;
    public string Username { get; set; } = string.Empty;
    public string Nickname { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string? Phone { get; set; }
    public string? Mail { get; set; }
}

public class UserInfo : PersonEntity
{
    public bool IsRoot { get; set; } = false;
    public string Captcha { get; set; } = string.Empty;
    public IdName CompanyIdName { get; set; } = new IdName();
    public IdName DepartmentIdName { get; set; } = new IdName();
    public IdName RoleIdName { get; set; } = new IdName();
    public List<AuthorityEntity> Authorities { get; set; } = new List<AuthorityEntity>();
    public string? Token { get; set; } = string.Empty;
}

public class CaptchaData
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public byte[]? Captcha { get; set; }
}
```

## 首页

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 场地数量 | Site/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 基站数量 | BaseStation/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 标签数量 | Tag/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 资产数量 | Asset/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |

## 标签

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 数量 | Tag/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 单条 | Tag/{id} | Get |   | MyActionResult\<TagEntity> |
| 集合 | Tag/List | Post | 集合查询参数 | MyActionResult\<List\<TagEntity>> |
| 增单条 | Tag | Post | \[FromBody\] TagEntity entity | MyActionResult\<TagEntity> |
| 增多条 | Tag/Range | Post | \[FromBody\] List\<TagEntity> entities | MyActionResult\<object> |
| 改单条 | Tag | Put | \[FromBody\] TagEntity entity | MyActionResult\<object> |
| 改多条 | Tag/Range | Put | \[FromBody\] List\<TagEntity> entities | MyActionResult\<object> |
| 删单条 | Tag/{id} | Delete |   | MyActionResult\<object> |
| 删多条 | Tag/Range | Delete | \[FromBody\] List\<TagEntity> entities | MyActionResult\<object> |
| 完整数据 | Tag/Full | Get | string? tagId, string? rfid | MyActionResult\<TagDto> |
| 完整集合 | Tag/FullList | Post | 集合查询参数 | MyActionResult\<List\<TagDto>> |

### Model

```cs
public class TagEntity
{
    public long Id { get; set; }
    public long Batch { get; set; }
    public long Type { get; set; }
    public long? Station { get; set; }
    public bool? IsFall { get; set; }
    public bool IsEnable { get; set; } = false;
    public EqpTypes EqpType { get; set; } = EqpTypes.Tag;
    public OnlineStates OnlineState { get; set; } = OnlineStates.Offline;
    public LocationModes? LocationMode { get; set; }
    public string TagId { get; set; } = string.Empty;
    public long? Asset { get; set; }
    public string? AssetId { get; set; }
    public string? Rfid { get; set; }
    public string? Imei { get; set; }
    public string? Iccid { get; set; }
    public int? Battery { get; set; }
    public int? Signal { get; set; }
    public double? Temperature { get; set; }
    public double? Longitude { get; set; }
    public double? Latitude { get; set; }
    public string? Comment { get; set; }
    public DateTime? ReportTime { get; set; }
}

public class TagDto : TagEntity
{
    public long? Company { get; set; }
    public string? CompanyName { get; set; }
    public long? Site { get; set; }
    public string? SiteName { get; set; }
    public string? Address { get; set; }
}
```

## 资产

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 数量 | Asset/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 单条 | Asset/{id} | Get |   | MyActionResult\<AssetEntity> |
| 集合 | Asset/List | Post | 集合查询参数 | MyActionResult\<List\<AssetEntity>> |
| 增单条 | Asset | Post | \[FromBody\] AssetEntity entity | MyActionResult\<AssetEntity> |
| 增多条 | Asset/Range | Post | \[FromBody\] List\<AssetEntity> entities | MyActionResult\<object> |
| 改单条 | Asset | Put | \[FromBody\] AssetEntity entity | MyActionResult\<object> |
| 改多条 | Asset/Range | Put | \[FromBody\] List\<AssetEntity> entities | MyActionResult\<object> |
| 删单条 | Asset/{id} | Delete |   | MyActionResult\<object> |
| 删多条 | Asset/Range | Delete | \[FromBody\] List\<AssetEntity> entities | MyActionResult\<object> |
| 完整数据 | Asset/Full | Get | long? id, string? rfid | MyActionResult\<AssetDto> |
| 完整集合 | Asset/FullList | Post | 集合查询参数 | MyActionResult\<List\<AssetDto>> |
| 位置 | Asset/Position/{asset} | Get |   | MyActionResult\<AssetPosition> |
| “位置”集合 | Asset/PositionList | Post | 集合查询参数 | MyActionResult\<List\<AssetPosition>> |
| 入库 | Asset/Inbound | Put | \[FromBody\] List\<long> ids | MyActionResult\<object> |
| 出库 | Asset/Outbound/{site} | Put | \[FromBody\] List\<long> ids | MyActionResult\<object> |

### Model

```cs
public class AssetPosition
{
    public long Id { get; set; }
    public string AssetId { get; set; } = string.Empty;
    public long? LastRecord { get; set; }
    public double? Longitude { get; set; }
    public double? Latitude { get; set; }
    public DateTime? ReportTime { get; set; }
    public LocationModes? LocationMode { get; set; }
}

public class AssetEntity : IdEntityBase
{
    public long Department { get; set; }
    public long Type { get; set; }
    public string AssetId { get; set; } = string.Empty;
    public string? Name { get; set; } = string.Empty;
    public string? Comment { get; set; } = string.Empty;
    public long? Tag { get; set; }
    public long? TagType { get; set; }
    // 计算:
    public AssetStates State { get; set; }
    public OnlineStates OnlineState { get; set; }
    public bool IsAuto { get; set; } = true;
    public bool? IsFall { get; set; } = false;
    public ErrorTypes? ErrorType { get; set; }
    public long? Vehicle { get; set; }
    public long? Transfer { get; set; }
    public long? LastRecord { get; set; } // 计算时才更新，建议使用GetLast获取最新记录
    public DateTime? BindingTime { get; set; }
    public DateTime? CalculationTime { get; set; }
    public int? DailyMove { get; set; }
    public int? MonthlyMove { get; set; }
    public int? TotalMove { get; set; }
    public double? StayDuration { get; set; }
    public double? TravelDuration { get; set; }
    public double? OfflineDuration { get; set; }
}

public class AssetDto : AssetEntity
{
    public long Company { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string TypeName { get; set; } = string.Empty;
    // 记录:
    public string? TagId { get; set; }
    public string? Rfid { get; set; }
    public string? Plate { get; set; }
    public long? Site { get; set; }
    public string? SiteName { get; set; }
    public int? Battery { get; set; }
    public string? FullAddr { get; set; }
    public string? TransferCode { get; set; }
}
```

## 资产记录

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 数量 | AssetRecord/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 单条 | AssetRecord/{id} | Get |   | MyActionResult\<AssetRecordEntity> |
| 集合 | AssetRecord/List | Post | 集合查询参数 | MyActionResult\<List\<AssetRecordEntity>> |
| 增单条 | AssetRecord | Post | \[FromBody\] AssetRecordEntity entity | MyActionResult\<AssetRecordEntity> |
| 增多条 | AssetRecord/Range | Post | \[FromBody\] List\<AssetRecordEntity> entities | MyActionResult\<object> |
| 改单条 | AssetRecord | Put | \[FromBody\] AssetRecordEntity entity | MyActionResult\<object> |
| 改多条 | AssetRecord/Range | Put | \[FromBody\] List\<AssetRecordEntity> entities | MyActionResult\<object> |
| 删单条 | AssetRecord/{id} | Delete |   | MyActionResult\<object> |
| 删多条 | AssetRecord/Range | Delete | \[FromBody\] List\<AssetRecordEntity> entities | MyActionResult\<object> |
| 完整数据 | AssetRecord/Full | Get | long? id, string? rfid | MyActionResult\<AssetRecordDto> |
| 最新数据 | AssetRecord/Last | Get | long asset | MyActionResult\<AssetRecordEntity> |
| 最新完整数据 | AssetRecord/FullLast | Get | long asset | MyActionResult\<AssetRecordDto> |
| 完整集合 | AssetRecord/FullList | Post | 集合查询参数 | MyActionResult\<List\<AssetRecordDto>> |
| 路径 | AssetRecord/Path | Post | 路径查询参数 | MyActionResult\<List\<AssetLngLat>> |

### 路径查询参数

```cs
long asset,
DateTime? start,
DateTime? end,
LocationModes? locationMode,
[FromBody] FilterDto? filter
```

## 绑定记录

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 数量 | BindingRecord/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 单条 | BindingRecord/{id} | Get |   | MyActionResult\<BindingRecordEntity> |
| 集合 | BindingRecord/List | Post | 集合查询参数 | MyActionResult\<List\<BindingRecordEntity>> |
| 增单条 | BindingRecord | Post | \[FromBody\] BindingRecordEntity entity | MyActionResult\<BindingRecordEntity> |
| 增多条 | BindingRecord/Range | Post | \[FromBody\] List\<BindingRecordEntity> entities | MyActionResult\<object> |
| 改单条 | BindingRecord | Put | \[FromBody\] BindingRecordEntity entity | MyActionResult\<object> |
| 改多条 | BindingRecord/Range | Put | \[FromBody\] List\<BindingRecordEntity> entities | MyActionResult\<object> |
| 删单条 | BindingRecord/{id} | Delete |   | MyActionResult\<object> |
| 删多条 | BindingRecord/Range | Delete | \[FromBody\] List\<BindingRecordEntity> entities | MyActionResult\<object> |
| 最新数据 | BindingRecord/Last | Get | long asset | MyActionResult\<BindingRecordEntity> |
| 完整集合 | BindingRecord/FullList | Get | long asset | MyActionResult\<List\<BindingRecordDto>> |

### Model

```cs
public class BindingRecordEntity
{
    public long? Id { get; set; }
    public long Tag { get; set; }
    public long Asset { get; set; }
    public bool IsBinding { get; set; }
    public DateTime Time { get; set; } = DateTimeHelper.GetUtcNow();
}

public class BindingRecordDto : BindingRecordEntity
{
    public string TagId { get; set; } = string.Empty;
    public string AssetId { get; set; } = string.Empty;
}
```

## 车辆

| Name | Action | Method | Param | Return |
| --- | --- | --- | --- | --- |
| 数量 | Vehicle/Count | Post | \[FromBody\] FilterDto? filter | MyActionResult\<int> |
| 单条 | Vehicle/{id} | Get |   | MyActionResult\<VehicleEntity> |
| 集合 | Vehicle/List | Post | 集合查询参数 | MyActionResult\<List\<VehicleEntity>> |
| 增单条 | Vehicle | Post | \[FromBody\] VehicleEntity entity | MyActionResult\<VehicleEntity> |
| 增多条 | Vehicle/Range | Post | \[FromBody\] List\<VehicleEntity> entities | MyActionResult\<object> |
| 改单条 | Vehicle | Put | \[FromBody\] VehicleEntity entity | MyActionResult\<object> |
| 改多条 | Vehicle/Range | Put | \[FromBody\] List\<VehicleEntity> entities | MyActionResult\<object> |
| 删单条 | Vehicle/{id} | Delete |   | MyActionResult\<object> |
| 删多条 | Vehicle/Range | Delete | \[FromBody\] List\<VehicleEntity> entities | MyActionResult\<object> |
| IdName集合 | Vehicle/SelectIdPlate | Post | \[FromBody\] FilterDto? filter | MyActionResult\<List\<IdName>> |

### Model

```cs
public class VehicleEntity
{
    public long Id { get; set; }
    public long Company { get; set; }
    public string Plate { get; set; } = string.Empty;
    public string? Logistics { get; set; }
    public string? Driver { get; set; }
    public string? Phone { get; set; }
}
```

## END