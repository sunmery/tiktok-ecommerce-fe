/**
 * 格式化工具函数
 */

/**
 * 格式化货币显示
 * @param amount 金额
 * @param currency 货币代码（如 USD、CNY 等）
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number, currency: string = 'CNY'): string => {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: currency || 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}
