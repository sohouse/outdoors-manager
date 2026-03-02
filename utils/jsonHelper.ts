export function createFilter<T extends object>(filterObj: Partial<Record<keyof T, T[keyof T]>>) {
    return (item: T): boolean => {
        // 遍历筛选对象的所有键，判断 item 是否全部匹配
        return Object.entries(filterObj).every(([key, value]) => {
            if (!Object.prototype.hasOwnProperty.call(item, key)) {
                return true;
            }
            const itemKey = key as keyof T;
            // 支持数组包含判断（比如 tags 数组）
            if (Array.isArray(item[itemKey]) && typeof value === 'string') {
                return (item[itemKey] as unknown as string[]).includes(value);
            }
            // 其他类型直接全等比较
            return item[itemKey] === value;
        });
    };
}