import {useCallback, useEffect, useState} from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Coordinates} from '@/types/logisticsMap';
import {showMessage} from "@/utils/showMessage";
// 确保导入 ShippingStatus
import {PaymentStatus, ShippingStatus} from "@/types/orders.ts";
import {getStatusText, shippingStatus as getShippingStatusText} from "@/utils/status.ts"; // 重命名导入避免冲突

// 定义类型
interface LogisticsMapProps {
    sellerPosition: Coordinates;
    userPosition: Coordinates;
    initialShippingStatus: ShippingStatus; // 初始物流状态
    paymentStatus?: PaymentStatus;
    onShippingStarted?: () => void; // 发货回调
    onInTransit?: () => void;       // 运输中回调
    onDeliveryComplete: () => void; // 送达回调
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
                          initialShippingStatus, // 使用初始状态
                          onDeliveryComplete,
                          onShippingStarted,   // 接收回调
                          onInTransit,         // 接收回调
                          paymentStatus = PaymentStatus.NotPaid,
                      }: LogisticsMapProps) => {
    // 状态管理 - 使用传入的初始状态初始化
    const [deliveryStatus, setDeliveryStatus] = useState<ShippingStatus>(initialShippingStatus);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState<Coordinates>(sellerPosition);
    const [routePath, setRoutePath] = useState<Coordinates[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [time, _] = useState(3000 * 10); // 缩短模拟时间以便测试
    const [isInTransitNotified, setIsInTransitNotified] = useState(false); // 确保 onInTransit 只调用一次

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
                throw new Error('无法获取路径数据'); // 抛出错误以便捕获
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                showMessage('路径数据无效', 'error')
                throw new Error('路径数据无效'); // 抛出错误以便捕获
            }

            // 从GeoJSON格式转换为[lat, lng]数组
            const coordinates = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]] as Coordinates
            );

            setRoutePath(coordinates);
        } catch (err) {
            console.error('获取路径失败:', err);
            const errorMsg = err instanceof Error ? err.message : '未知错误';
            setError(`获取路径失败: ${errorMsg}. 使用直线路径代替。`);
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
        // 仅在需要运输时获取路径
        if (initialShippingStatus === ShippingStatus.ShippingPending || initialShippingStatus === ShippingStatus.ShippingWaitCommand) {
            fetchRoutePath().catch(err => {
                console.error('初始化路径失败:', err);
                setError(err instanceof Error ? err.message : '未知错误');
            });
        } else if (initialShippingStatus === ShippingStatus.ShippingShipped || initialShippingStatus === ShippingStatus.ShippingInTransit) {
            // 如果已经是运输中或已发货，也需要路径来显示当前位置
            fetchRoutePath().catch(err => {
                console.error('初始化路径失败:', err);
                setError(err instanceof Error ? err.message : '未知错误');
            });
            // 注意：这里可能需要根据后端数据设置 progress 和 currentPosition
            // 暂时简化，从头开始模拟或显示最终位置
            if (initialShippingStatus === ShippingStatus.ShippingShipped || initialShippingStatus === ShippingStatus.ShippingInTransit) {
                setDeliveryStatus(ShippingStatus.ShippingShipped); // 确保状态正确以启动模拟
            }
        } else if (initialShippingStatus === ShippingStatus.ShippingDelivered) {
            // 如果已送达，直接设置最终位置
            setCurrentPosition(userPosition);
        }
    }, [fetchRoutePath, initialShippingStatus, userPosition]); // 添加依赖

    // 监听外部状态变化，如果外部状态变为已发货，则启动或继续模拟
    useEffect(() => {
        if (initialShippingStatus === ShippingStatus.ShippingShipped && deliveryStatus !== ShippingStatus.ShippingShipped) {
            setDeliveryStatus(ShippingStatus.ShippingShipped);
            setIsInTransitNotified(false); // 重置运输中通知状态
        }
        // 如果外部状态更新为其他（例如 Pending 或 Delivered），则相应更新内部状态
        else if (initialShippingStatus !== deliveryStatus && initialShippingStatus !== ShippingStatus.ShippingShipped) {
            setDeliveryStatus(initialShippingStatus);
            if (initialShippingStatus === ShippingStatus.ShippingDelivered) {
                setCurrentPosition(userPosition);
            } else {
                setCurrentPosition(sellerPosition);
            }
            setProgress(0); // 重置进度
            setIsInTransitNotified(false);
        }
    }, [initialShippingStatus, deliveryStatus, sellerPosition, userPosition]);


    // 模拟物流运输
    useEffect(() => {
        // 只有在状态为 Shipped 且有路径时才模拟
        if (deliveryStatus === ShippingStatus.ShippingShipped && routePath.length > 0) {
            // 如果进度为0，设置起始位置
            if (progress === 0) {
                setCurrentPosition(routePath[0]);
            }

            const totalSteps = routePath.length - 1;
            if (totalSteps <= 0) return; // 路径点不足

            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + 1;

                    // 检查是否到达中点且未通知
                    if (!isInTransitNotified && newProgress >= totalSteps / 2) {
                        onInTransit?.(); // 调用运输中回调
                        setIsInTransitNotified(true); // 标记已通知
                    }

                    if (newProgress >= totalSteps) {
                        clearInterval(interval);
                        setCurrentPosition(routePath[totalSteps]); // 确保停在终点
                        setDeliveryStatus(ShippingStatus.ShippingDelivered); // 更新内部状态
                        onDeliveryComplete(); // 调用送达回调
                        return totalSteps; // 返回最终进度
                    }

                    setCurrentPosition(routePath[newProgress]);
                    return newProgress;
                });
            }, time / totalSteps); // 总时间

            return () => clearInterval(interval); // 清理 interval
        } else if (deliveryStatus === ShippingStatus.ShippingDelivered) {
            // 如果状态已经是 Delivered，确保位置是终点
            setCurrentPosition(userPosition);
            setProgress(routePath.length > 0 ? routePath.length - 1 : 0);
        } else {
            // 其他状态，重置位置和进度
            setCurrentPosition(sellerPosition);
            setProgress(0);
            setIsInTransitNotified(false);
        }
        // 依赖项应包括可能影响模拟启动或路径的变量
    }, [deliveryStatus, routePath, onDeliveryComplete, onInTransit, time, isInTransitNotified, progress, sellerPosition, userPosition]);


    // 开始运输按钮点击处理
    const handleStartDeliveryClick = () => {
        // 只有在 Pending 或 WaitCommand 状态下才能点击开始
        if (deliveryStatus === ShippingStatus.ShippingPending || deliveryStatus === ShippingStatus.ShippingWaitCommand) {
            onShippingStarted?.(); // 调用发货回调，让父组件处理API调用
            // 注意：内部状态将在父组件成功调用API后通过 initialShippingStatus prop 更新
            // setDeliveryStatus(ShippingStatus.ShippingShipped); // 不再直接修改内部状态
            setIsInTransitNotified(false); // 重置运输中通知状态
        }
    };

    // 计算卡车应该显示的位置
    const truckDisplayPosition = deliveryStatus === ShippingStatus.ShippingDelivered ? userPosition : currentPosition;
    // 只有在运输过程中才显示卡车
    const showTruck = deliveryStatus === ShippingStatus.ShippingShipped || deliveryStatus === ShippingStatus.ShippingInTransit || deliveryStatus === ShippingStatus.ShippingDelivered;


    return (
        <div className="logistics-container">
            <div className="status-control">
                <p>支付状态：{getStatusText(paymentStatus)}</p>
                {/* 使用重命名后的函数 */}
                <p>物流状态：{getShippingStatusText(deliveryStatus)}</p>
                {/* 只有在特定状态下才显示按钮 */}
                {(deliveryStatus === ShippingStatus.ShippingPending || deliveryStatus === ShippingStatus.ShippingWaitCommand) && (
                    <button onClick={handleStartDeliveryClick} disabled={isLoading || routePath.length === 0}>
                        {isLoading ? '加载路径中...' : '模拟发货'}
                    </button>
                )}

                {error && <p className="error-message">注意: {error}</p>}
            </div>

            <MapContainer
                // 根据状态决定中心点
                center={deliveryStatus === ShippingStatus.ShippingDelivered ? userPosition : sellerPosition}
                zoom={13}
                style={{height: '400px', width: '100%'}}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* 绘制路线 */}
                {routePath.length > 0 && <Polyline positions={routePath} color="blue"/>}

                {/* 商家位置 */}
                <Marker position={sellerPosition} icon={sellerIcon}>
                    <Popup>商家位置</Popup>
                </Marker>

                {/* 用户位置 */}
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>收货地址</Popup>
                </Marker>

                {/* 卡车位置 - 仅在运输相关状态显示 */}
                {showTruck && routePath.length > 0 && (
                    <Marker position={truckDisplayPosition} icon={truckIcon}>
                        <Popup>运输中... {Math.round((progress / (routePath.length - 1 || 1)) * 100)}%</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LogisticsMap;
