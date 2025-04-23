import {useCallback, useEffect, useState} from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Coordinates} from '@/types/logisticsMap';
import {showMessage} from "@/utils/showMessage.ts";
import {PaymentStatus, ShippingStatus} from "@/types/orders.ts";
import {getStatusText, shippingStatus} from "@/utils/status.ts";

// 定义类型
interface LogisticsMapProps {
    sellerPosition: Coordinates;
    userPosition: Coordinates;
    onDeliveryComplete: () => void;
    paymentStatus?: PaymentStatus;
}

// 自定义图标
const sellerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167755.png',
    iconSize: [32, 32],
});

const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
});

const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097143.png',
    iconSize: [32, 32],
});

const LogisticsMap = ({
                          sellerPosition,
                          userPosition,
                          onDeliveryComplete,
                          paymentStatus = PaymentStatus.NotPaid,
                      }: LogisticsMapProps) => {
    // 状态管理
    const [deliveryStatus, setDeliveryStatus] = useState<ShippingStatus>(ShippingStatus.ShippingPending);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState<Coordinates>(sellerPosition);
    const [routePath, setRoutePath] = useState<Coordinates[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [time, setTime] = useState(30000 * 30)
    // 获取实际道路路径
    const fetchRoutePath = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 使用OSRM服务获取路径
            // 注意：OSRM API需要经度在前，纬度在后
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${sellerPosition[1]},${sellerPosition[0]};${userPosition[1]},${userPosition[0]}?overview=full&geometries=geojson`
            );

            if (!response.ok) {
                showMessage('无法获取路径数据', 'error')
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                showMessage('路径数据无效', 'error')
            }

            // 从GeoJSON格式转换为[lat, lng]数组
            const coordinates = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]] as Coordinates
            );

            setRoutePath(coordinates);
        } catch (err) {
            console.error('获取路径失败:', err);
            setError(err instanceof Error ? err.message : '未知错误');
            // 如果API调用失败，回退到直线路径
            setRoutePath(generateStraightPath());
        } finally {
            setIsLoading(false);
        }
    }, [sellerPosition, userPosition]);

    // 生成直线路径（作为备用）
    const generateStraightPath = useCallback(() => {
        const path: Coordinates[] = [];
        const steps = 30;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const lat = sellerPosition[0] + (userPosition[0] - sellerPosition[0]) * t;
            const lng = sellerPosition[1] + (userPosition[1] - sellerPosition[1]) * t;
            path.push([lat, lng]);
        }

        return path;
    }, [sellerPosition, userPosition]);

    // 初始化时获取路径
    useEffect(() => {
        fetchRoutePath().catch(err => {
            console.error('初始化路径失败:', err);
            setError(err instanceof Error ? err.message : '未知错误');
        });
    }, [fetchRoutePath]);

    // 模拟物流运输
    useEffect(() => {
        if (deliveryStatus === ShippingStatus.ShippingShipped && routePath.length > 0) {
            setCurrentPosition(routePath[0]);

            const totalSteps = routePath.length - 1;
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + 1;

                    if (newProgress >= totalSteps) {
                        clearInterval(interval);
                        setDeliveryStatus(ShippingStatus.ShippingDelivered);
                        onDeliveryComplete();
                        return prev;
                    }

                    setCurrentPosition(routePath[newProgress]);
                    return newProgress;
                });
            }, time / totalSteps); // 总时间

            return () => clearInterval(interval);
        }
    }, [deliveryStatus, routePath, onDeliveryComplete]);

    // 开始运输
    const startDelivery = () => {
        setDeliveryStatus(ShippingStatus.ShippingShipped);
    };

    return (
        <div className="logistics-container">
            <div className="status-control">
                <p>支付状态：{getStatusText(paymentStatus)}</p>
                <p>物流状态：{shippingStatus(deliveryStatus)}</p>
                {deliveryStatus === ShippingStatus.ShippingPending && (
                    <button onClick={startDelivery} disabled={isLoading || routePath.length === 0}>
                        {isLoading ? '加载路径中...' : '模拟发货'}
                    </button>
                )}

                {error && <p className="error-message">注意: {error}. 使用直线路径代替。</p>}
            </div>

            <MapContainer
                center={sellerPosition}
                zoom={13}
                style={{height: '400px', width: '100%'}}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* 路线 */}
                {routePath.length > 0 && (
                    <Polyline
                        positions={routePath}
                        color="blue"
                        weight={3}
                    />
                )}

                {/* 商家位置 */}
                <Marker position={sellerPosition} icon={sellerIcon}>
                    <Popup>商家位置</Popup>
                </Marker>

                {/* 用户位置 */}
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>收货地址</Popup>
                </Marker>

                {/* 移动的运输车辆 */}
                {deliveryStatus !== ShippingStatus.ShippingPending && routePath.length > 0 && (
                    <Marker position={currentPosition} icon={truckIcon}>
                        <Popup>运输中 ({Math.round((progress / (routePath.length - 1)) * 100)}%)</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LogisticsMap;
