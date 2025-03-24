/**
 * 合并类名工具函数
 * @param inputs 要合并的类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}