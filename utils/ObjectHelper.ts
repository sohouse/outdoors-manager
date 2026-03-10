export function simpleObjCover<T extends Record<string, unknown>, R extends Record<string, unknown>>(fromObj: T, targetObj: R): R {
    if (!fromObj || typeof fromObj !== 'object') throw new Error('待转换对象空');
    // 提取fromObj的对象字段到键值对中做后续循环

    const resultObj = {} as R;
    const schemaKeys = Object.keys(targetObj) as Array<keyof R>;

    for (const k of schemaKeys) {
        const propKey = k;
        const rawValue = (fromObj as Record<string, unknown>)[k as string];

        // 跳过不存在的属性
        if (rawValue === undefined) continue;

        const targetValue = targetObj[propKey];
        const targetValueUnknown = targetValue as unknown;
        const targetType = typeof targetValue;

        if (targetType === 'number') {
            // 字符串转数字（处理如 "5" -> 5 的场景）
            (resultObj as Record<keyof R, unknown>)[propKey] = isNaN(Number(rawValue)) ? 0 : Number(rawValue);
        } else if (targetType === 'string') {
            // 任意类型转字符串
            (resultObj as Record<keyof R, unknown>)[propKey] = String(rawValue);
        } else if (targetType === 'boolean') {
            // 处理 'true'/'false' 或 1/0 转布尔值
            (resultObj as Record<keyof R, unknown>)[propKey] = rawValue === 'true' || rawValue === 1 || rawValue === true;
        } else if (Array.isArray(targetValue)) {
            // 非数组转数组（如单个值转数组）
            (resultObj as Record<keyof R, unknown>)[propKey] = Array.isArray(rawValue)
                ? [...rawValue]
                : [rawValue];
        } else if (targetValueUnknown instanceof Date) {
            // Date 类型转换
            const rawValueUnknown = rawValue as unknown;
            const dateVal = rawValueUnknown instanceof Date
                ? rawValueUnknown
                : rawValue
                    ? new Date(rawValue as string | number)
                    : new Date();
            (resultObj as Record<keyof R, unknown>)[propKey] = isNaN(dateVal.getTime())
                ? targetValue
                : dateVal;
        } else if (targetType === 'object' && targetValue !== null) {
            // 对象类型直接赋值（浅拷贝）
            (resultObj as Record<keyof R, unknown>)[propKey] = typeof rawValue === 'object' && !Array.isArray(rawValue)
                ? { ...rawValue }
                : {};
        } else {
            // 默认直接赋值
            (resultObj as Record<keyof R, unknown>)[propKey] = rawValue;
        }

    }

    return resultObj;
}
