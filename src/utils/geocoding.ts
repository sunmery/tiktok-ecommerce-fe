import AMapLoader from "@amap/amap-jsapi-loader";
import {Coordinates, GeocoderResult} from '@/types/logisticsMap';

/**
 * 通过地址获取坐标（使用高德地图API）
 * @param address 地址字符串，如"北京东城区"
 * @returns Promise<Coordinates> 返回[纬度, 经度]格式的坐标
 */

export const getCoordinatesByAddress = async (address: string): Promise<Coordinates> => {
    window._AMapSecurityConfig = {
        securityJsCode: "f60315e68d0c7c0be5e4f890b9803aea",
    };

    try {
        const AMap = await AMapLoader.load({
            key: "d581b609de4c928ac3831d2967c06004",
            version: "2.0",
            plugins: ["AMap.Geocoder"],
        });

        return new Promise((resolve, reject) => {
            const geocoder = new AMap.Geocoder({
                city: "全国",
            });

            geocoder.getLocation(address, (status: string, result: GeocoderResult) => {
                if (status === "complete" && result.info === "OK") {
                    const lat = result.geocodes[0].location.lat;
                    const lng = result.geocodes[0].location.lng;
                    console.log("获取坐标成功:", [lat, lng]);
                    resolve([lat, lng]);
                } else {
                    reject(new Error(`地理编码失败: ${status}`));
                }
            });
        });
    } catch (error) {
        console.error("加载高德地图API失败:", error);
        throw error;
    }
}
