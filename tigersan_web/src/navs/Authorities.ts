import { authorityHelper } from "@/0_tigersan_ui/tigerui"

export class Authorities {
    /** 基础设置 */
    static BasicSettingsFolder = authorityHelper.GetAuthority()
    static CompanyMgtPage = authorityHelper.GetAuthority()
    static DepartmentMgtPage = authorityHelper.GetAuthority()
    static RoleMgtPage = authorityHelper.GetAuthority()
    static PersonMgtPage = authorityHelper.GetAuthority()
    static SiteMgt = authorityHelper.GetAuthority()
    /** 基站管理 */
    static BaseStationMgtFolder = authorityHelper.GetAuthority()
    static BaseStationMgtPage = authorityHelper.GetAuthority()
    /** 标签管理 */
    static TagMgtFolder = authorityHelper.GetAuthority()
    static PersonMgtTagPage = authorityHelper.GetAuthority()
    static AssetMgtTagPage = authorityHelper.GetAuthority()
    static EnvSensorPage = authorityHelper.GetAuthority()
    /** 设备管理 */
    static EqpMgtFolder = authorityHelper.GetAuthority()
    static Terminal4gPage = authorityHelper.GetAuthority()
    /** 操作管理 */
    static OperationMgtFolder = authorityHelper.GetAuthority()
    static OperationRecordPage = authorityHelper.GetAuthority()
    static OperationRetryPage = authorityHelper.GetAuthority()
    /** 字典管理 */
    static DictionaryMgtFolder = authorityHelper.GetAuthority()
    static SiteType = authorityHelper.GetAuthority()
    static StationType = authorityHelper.GetAuthority()
    /** 系统设置 */
    static SystemSettingsFolder = authorityHelper.GetAuthority()
    static SystemSettingsPage = authorityHelper.GetAuthority()
    static AlarmMgtPage = authorityHelper.GetAuthority()
    /** 业务类别 1 */
    static BusinessFolder1 = authorityHelper.GetAuthority()
    static Business1 = authorityHelper.GetAuthority()
    static Business2 = authorityHelper.GetAuthority()
}