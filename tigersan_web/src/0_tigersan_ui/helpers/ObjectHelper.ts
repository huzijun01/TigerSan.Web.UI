/** 从对象中获取指定字段 */
function DefaultStringGetter(obj: object, propName: string): string {
    const value = (obj as Record<string, unknown>)[propName];

    // 处理 null/undefined 和其他类型的转换
    return value != null ? String(value) : ''
}

/** 将值赋给对象中获取指定字段 */
function DefaultObjectSetter(obj: object, propName: string, value: any): void {
    (obj as Record<string, any>)[propName] = value;
}

export {
    DefaultStringGetter,
    DefaultObjectSetter,
}