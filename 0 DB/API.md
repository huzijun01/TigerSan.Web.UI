# API

## User

| Name | URL | Action | Param | Return |
| --- | --- | --- | --- | --- |
| EditPassword | Password | Put | PasswordEdit edit | MyActionResult |
| Login | Login | Get | string id, string captcha, string search, string password | MyActionResult\<UserInfo> |
| LoginByToken | LoginByToken | Get | string token | MyActionResult\<UserInfo> |
| Logout | Logout | Get | string username | MyActionResult |
| GetCaptcha | Captcha | Post |   | MyActionResult\<CaptchaData> |

## Tag

| Name | URL | Action | Param | Return |
| --- | --- | --- | --- | --- |
| GetFull | Full | Get | string? tagId = null, string? rfid = null | MyActionResult\<CaptchaData> |
| GetByTagId | ByTagId/{tagId} | Get |   | MyActionResult\<TagEntity> |
| GetFullByTagId | FullByTagId/{tagId} | Get |   | MyActionResult\<TagDto> |
| GetByRFID | ByRFID/{rfid} | Get |   | MyActionResult\<TagEntity> |
| GetFullList | FullList | Post | int? pageSize = null, int? pageNumber = null, string? sort = null, bool? ascending = null, \[FromBody\] FilterDto? filter = null | MyActionResult\<List\<TagDto>> |

## Continue

# Model

## END