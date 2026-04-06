namespace TigerSan.NET8.WebApi.Share.Dtos
{
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

    #region “父表”模型
    /// <summary>“父表”模型</summary>
    public class ParentFilterModel
    {
        /// <summary>父表</summary>
        public ParentFilterModel? Parent { get; set; }
        /// <summary>实体类型</summary>
        public Type EntityType { get; set; }
        /// <summary>DbSet名称</summary>
        public string DbSetName { get; set; }
        /// <summary>父项ID属性名称</summary>
        public string? ParentIdPropName { get; set; }

        public ParentFilterModel(
            Type entityType,
            string dbSetName,
            string? parentIdPropName = null,
            ParentFilterModel? parent = null)
        {
            EntityType = entityType;
            DbSetName = dbSetName;
            ParentIdPropName = parentIdPropName;
            Parent = parent;
        }

        public ParentFilterModel AddParent(
            Type entityType,
            string dbSetName,
            string? parentIdPropName = null)
        {
            var parent = new ParentFilterModel(entityType, dbSetName, parentIdPropName);
            Parent = parent;
            return parent;
        }
    }
    #endregion

    #region ID值对
    /// <summary>ID值对</summary>
    public class IdValue<TField>
    {
        public long Id { get; set; }
        public TField Value { get; set; }

        public IdValue(TField value)
        {
            Value = value;
        }
    }
    #endregion
}
