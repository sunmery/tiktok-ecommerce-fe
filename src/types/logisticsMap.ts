/**
 * 共享类型定义文件
 */

// 坐标类型定义 - 表示[纬度, 经度]格式的坐标
export type Coordinates = [number, number];

// 地址类型定义
export interface Address {
    formatted: string;  // 格式化的地址字符串
    city?: string;      // 城市
    district?: string;  // 区县
    street?: string;    // 街道
}

// 物流状态类型定义
export type DeliveryStatus = 'pending' | 'shipped' | 'in_transit' | 'delivered';

// 高德地图API响应类型
export interface GeocoderResult {
    status: string;
    info: string;
    geocodes: Array<{
        location: {
            lat: number;
            lng: number;
        };
        formatted_address: string;
    }>;
}

// 路径数据类型
export interface RouteData {
    code: string;
    routes: Array<{
        geometry: {
            coordinates: [number, number][];
        };
    }>;
}
