/**
 * 分析数据处理工具
 * 用于处理订单数据，生成分析图表所需的数据结构
 */

import { Order } from '@/types/orders';

// 分组后的销售数据类型
export interface GroupedSalesData {
  daily: Array<{ date: string; sales: number; orders: number }>;
  weekly: Array<{ date: string; sales: number; orders: number }>;
  monthly: Array<{ date: string; sales: number; orders: number }>;
}

/**
 * 按日期分组订单数据
 * @param orders 订单列表
 * @returns 按日、周、月分组的销售数据
 */
export function groupOrdersByDate(orders: Order[]): GroupedSalesData {
  // 初始化结果对象
  const result: GroupedSalesData = {
    daily: [],
    weekly: [],
    monthly: []
  };

  // 如果没有订单数据，返回空结果
  if (!orders || orders.length === 0) {
    return result;
  }

  // 按日期分组的映射
  const dailyMap = new Map<string, { sales: number; orders: number }>();
  const weeklyMap = new Map<string, { sales: number; orders: number }>();
  const monthlyMap = new Map<string, { sales: number; orders: number }>();

  // 处理每个订单
  orders.forEach(order => {
    // 解析订单创建时间
    const orderDate = new Date(order.createdAt);
    
    // 计算订单总金额
    const orderTotal = order.items.reduce((sum, item) => sum + item.cost, 0);
    
    // 格式化日期字符串
    const dayStr = orderDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const weekStr = `第${getWeekNumber(orderDate)}周`;
    const monthStr = `${orderDate.getMonth() + 1}月`;
    
    // 按日累加
    if (!dailyMap.has(dayStr)) {
      dailyMap.set(dayStr, { sales: 0, orders: 0 });
    }
    const dayData = dailyMap.get(dayStr)!;
    dayData.sales += orderTotal;
    dayData.orders += 1;
    
    // 按周累加
    if (!weeklyMap.has(weekStr)) {
      weeklyMap.set(weekStr, { sales: 0, orders: 0 });
    }
    const weekData = weeklyMap.get(weekStr)!;
    weekData.sales += orderTotal;
    weekData.orders += 1;
    
    // 按月累加
    if (!monthlyMap.has(monthStr)) {
      monthlyMap.set(monthStr, { sales: 0, orders: 0 });
    }
    const monthData = monthlyMap.get(monthStr)!;
    monthData.sales += orderTotal;
    monthData.orders += 1;
  });

  // 转换Map为数组并排序
  result.daily = Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  result.weekly = Array.from(weeklyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => {
      // 提取周数进行排序
      const weekA = parseInt(a.date.replace(/[^0-9]/g, ''));
      const weekB = parseInt(b.date.replace(/[^0-9]/g, ''));
      return weekA - weekB;
    });

  result.monthly = Array.from(monthlyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => {
      // 提取月份进行排序
      const monthA = parseInt(a.date.replace(/[^0-9]/g, ''));
      const monthB = parseInt(b.date.replace(/[^0-9]/g, ''));
      return monthA - monthB;
    });

  return result;
}

/**
 * 获取日期所在的周数
 * @param date 日期对象
 * @returns 周数(1-53)
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}