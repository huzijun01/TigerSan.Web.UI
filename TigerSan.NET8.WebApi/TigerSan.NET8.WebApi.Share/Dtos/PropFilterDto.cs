namespace TigerSan.NET8.WebApi.Share.Dtos
{
    #region 过滤器
    /// <summary>过滤器</summary>
    public class FilterDto
    {
        /// <summary>父表</summary>
        public ParentFilterDto? Parent { get; set; }
        /// <summary>“过滤器”集合</summary>
        public List<PropFilterDto>? Filters { get; set; }
    }
    #endregion

    #region 属性过滤器
    /// <summary>属性过滤器</summary>
    public class PropFilterDto
    {
        /// <summary>属性名</summary>
        public string PropName { get; set; } = string.Empty;
        /// <summary>值</summary>
        public object? Value { get; set; }
        /// <summary>值集合</summary>
        public List<object>? Values { get; set; }
        /// <summary>父表</summary>
        public ParentFilterDto? Parent { get; set; }
    }
    #endregion

    #region 父表过滤器
    /// <summary>父表过滤器</summary>
    public class ParentFilterDto : ParentBase<ParentFilterDto>
    {
        /// <summary>ID集合</summary>
        public List<long> Ids { get; set; } = new List<long>();
    }
    #endregion

    #region “父表”模型
    /// <summary>“父表”模型</summary>
    public class ParentFilterModel : ParentBase<ParentFilterModel>
    {
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

    #region “父表”基类
    /// <summary>“父表”基类</summary>
    public class ParentBase<T> where T : ParentBase<T>
    {
        /// <summary>父表</summary>
        public T? Parent { get; set; }

        /// <summary>层级</summary>
        public int Larger { get => GetLarger(); }

        #region 【Functions】
        #region 获取“层级”
        private int GetLarger()
        {
            if (Parent == null) return 1;
            return Parent.GetLarger() + 1;
        }
        #endregion

        #region 获取“父表”
        public ParentBase<T>? Get(int larger)
        {
            if (Larger == larger) return this;
            if (Parent == null) return null;
            return Parent.Get(larger);
        }

        public ParentBase<T>? Get(ParentBase<T> larger)
        {
            return Get(larger.Larger);
        }
        #endregion
        #endregion 【Functions】
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
