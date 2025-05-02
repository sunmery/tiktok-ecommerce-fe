import {useCallback, useEffect, useRef, useState} from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Coordinates} from '@/types/logisticsMap';
import {showMessage} from "@/utils/showMessage";
// 确保导入 ShippingStatus
import {PaymentStatus, ShippingStatus} from "@/types/orders.ts";
import {getStatusText, shippingStatus as getShippingStatusText} from "@/utils/status.ts"; // 重命名导入避免冲突
import { useTranslation } from 'react-i18next'; // <-- 添加导入

// 定义类型
interface LogisticsMapProps {
    sellerPosition: Coordinates;
    userPosition: Coordinates;
    initialShippingStatus: ShippingStatus; // 初始物流状态
    paymentStatus?: PaymentStatus;
    onShippingStarted?: () => void; // 发货回调
    onInTransit?: () => void;       // 运输中回调
    onDeliveryComplete: () => void; // 送达回调
    startAnimation?: boolean;       // 新增：控制动画开始执行的标志
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
                          initialShippingStatus, // Use this instead of shippingInfo.shippingStatus
                          onDeliveryComplete,
                          onShippingStarted,
                          onInTransit,
                          paymentStatus = PaymentStatus.NotPaid,
                          startAnimation = false,
                      }: LogisticsMapProps) => {
    const { t } = useTranslation(); // <-- 获取 t 函数
    // 状态管理 - 使用传入的初始状态初始化
    const [deliveryStatus, setDeliveryStatus] = useState<ShippingStatus>(initialShippingStatus);
    const [progress, setProgress] = useState(0); // 仅用于显示或触发其他逻辑，不由动画 effect 直接依赖
    const [currentPosition, setCurrentPosition] = useState<Coordinates>(sellerPosition);
    const [routePath, setRoutePath] = useState<Coordinates[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [time, _] = useState(300 * 10); // 缩短模拟时间以便测试
    const [isInTransitNotified, setIsInTransitNotified] = useState(false); // 确保 onInTransit 只调用一次
    // --- 移除 animationStarted 状态 ---
    // const [animationStarted, setAnimationStarted] = useState(false);

    // Ref to track if the animation for the current shipment has been executed
    const animationExecutedRef = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID

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
                showMessage(t('logisticsMap.error.fetchRouteFailed'), 'error') // <-- 使用 t()
                throw new Error(t('logisticsMap.error.fetchRouteFailed')); // <-- 使用 t()
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                showMessage(t('logisticsMap.error.invalidRouteData'), 'error') // <-- 使用 t()
                throw new Error(t('logisticsMap.error.invalidRouteData')); // <-- 使用 t()
            }

            // 从GeoJSON格式转换为[lat, lng]数组
            const coordinates = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]] as Coordinates
            );

            setRoutePath(coordinates);
            console.log("路径加载成功，长度:", coordinates.length); // 添加日志
        } catch (err) {
            console.error('获取路径失败:', err);
            const errorMsg = err instanceof Error ? err.message : '未知错误';
            setError(t('logisticsMap.error.fetchRouteFallback', { errorMsg })); // <-- 使用 t() 和插值
            // 如果API调用失败，回退到直线路径
            const straightPath = generateStraightPath();
            setRoutePath(straightPath);
            console.log("使用直线路径，长度:", straightPath.length); // 添加日志
        } finally {
            setIsLoading(false);
        }
    }, [sellerPosition, userPosition, t]); // <-- 添加 t 依赖

    // 生成直线路径（作为备用）
    const generateStraightPath = useCallback(() => {
        const path: Coordinates[] = [];
        const steps = 30; // 可以适当增加步数使直线更平滑

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const lat = sellerPosition[0] + (userPosition[0] - sellerPosition[0]) * t;
            const lng = sellerPosition[1] + (userPosition[1] - sellerPosition[1]) * t;
            path.push([lat, lng]);
        }
        return path;
    }, [sellerPosition, userPosition]);


    // 初始化时获取路径或设置状态
    useEffect(() => {
        console.log("初始化 Effect - initialShippingStatus:", initialShippingStatus);
        setDeliveryStatus(initialShippingStatus); // 同步内部状态

        if (initialShippingStatus === ShippingStatus.ShippingDelivered) {
            console.log("初始化：已送达，设置终点位置");
            setCurrentPosition(userPosition);
            animationExecutedRef.current = true; // 标记动画已完成（或无需执行）
            // 确保进度条满
             if (routePath.length > 0) { // 检查路径是否存在
                 setProgress(routePath.length -1);
             } else {
                 // 如果没有路径，也设置一个象征性的满进度值，或者根据需要处理
                 setProgress(100); // 或者其他表示完成的值
             }
        } else if (initialShippingStatus === ShippingStatus.ShippingPending || initialShippingStatus === ShippingStatus.ShippingWaitCommand) {
            console.log("初始化：待处理/待指令，重置位置和动画标记");
            setCurrentPosition(sellerPosition);
            setProgress(0);
            animationExecutedRef.current = false; // 重置动画标记
            setIsInTransitNotified(false);
            // 考虑是否在此处预加载路径
            // fetchRoutePath().catch(err => console.error('预加载路径失败:', err));
        } else if (initialShippingStatus === ShippingStatus.ShippingShipped || initialShippingStatus === ShippingStatus.ShippingInTransit) {
            console.log("初始化：运输中/已发货，获取路径并准备动画");
            setCurrentPosition(sellerPosition); // 动画将从起点开始
            setProgress(0);
            animationExecutedRef.current = false; // 确保可以开始动画
            setIsInTransitNotified(false);
            if (routePath.length === 0) { // 仅在没有路径时获取
                fetchRoutePath().catch(err => console.error('初始化路径获取失败:', err));
            }
        }
    }, [initialShippingStatus, userPosition, sellerPosition, fetchRoutePath]); // 依赖项应包含所有读取的 props/state


    // 监听外部 initialShippingStatus 变化，同步内部状态
    // 这个 effect 主要用于处理外部状态变化 *之后* 的同步，而不是初始化
    useEffect(() => {
        // 避免在初始化时重复设置（上面的 effect 已处理）
        if (initialShippingStatus !== deliveryStatus) {
             console.log(`外部状态变化: ${initialShippingStatus}, 当前内部状态: ${deliveryStatus}`);
             setDeliveryStatus(initialShippingStatus); // 同步状态

             if (initialShippingStatus === ShippingStatus.ShippingDelivered) {
                 console.log("外部状态变为已送达，设置终点位置并标记完成");
                 setCurrentPosition(userPosition);
                 animationExecutedRef.current = true; // 标记完成
                 // 清理可能正在运行的 interval
                 if (intervalRef.current) {
                     clearInterval(intervalRef.current);
                     intervalRef.current = null;
                     console.log("清理因状态变为 Delivered 的 interval");
                 }
                 // 设置进度为满
                 if (routePath.length > 0) {
                     setProgress(routePath.length - 1);
                 } else {
                     setProgress(100); // 或者其他完成值
                 }

             } else if (initialShippingStatus === ShippingStatus.ShippingPending || initialShippingStatus === ShippingStatus.ShippingWaitCommand) {
                 console.log("外部状态变为 Pending/WaitCommand，重置状态");
                 setCurrentPosition(sellerPosition);
                 setProgress(0);
                 animationExecutedRef.current = false; // 重置标记，允许新动画
                 setIsInTransitNotified(false);
                 // 清理可能正在运行的 interval
                 if (intervalRef.current) {
                     clearInterval(intervalRef.current);
                     intervalRef.current = null;
                      console.log("清理因状态变为 Pending/WaitCommand 的 interval");
                 }
             } else if (initialShippingStatus === ShippingStatus.ShippingShipped) {
                 // 如果外部变为 Shipped，确保内部状态同步，并重置动画标记（如果需要重新开始）
                 // 通常，如果已经是 Shipped，我们不希望重置动画，除非是全新的发货
                 // 这里假设外部变为 Shipped 时，如果动画未执行，则应该准备执行
                 if (!animationExecutedRef.current) {
                     console.log("外部状态变为 Shipped，准备动画（如果尚未执行）");
                     setCurrentPosition(sellerPosition); // 确保从起点开始
                     setProgress(0);
                     setIsInTransitNotified(false);
                     // 如果路径未加载，加载路径
                     if (routePath.length === 0) {
                         fetchRoutePath().catch(err => console.error('状态驱动的路径获取失败:', err));
                     }
                 }
             }
        }
    }, [initialShippingStatus, deliveryStatus, userPosition, sellerPosition, fetchRoutePath, routePath]); // 添加 routePath 依赖


    // --- 移除监听 startAnimation 和 animationStarted 的 Effect ---
    // useEffect(() => { ... }, [startAnimation, fetchRoutePath, routePath.length, sellerPosition, animationStarted]);

    // --- 移除监听 initialShippingStatus 和 animationStarted 的 Effect ---
    // useEffect(() => { ... }, [initialShippingStatus, userPosition, animationStarted]);

    // --- 移除旧的模拟物流运输 Effect (约 208 行) ---
    // useEffect(() => { ... }, [deliveryStatus, routePath, onDeliveryComplete, onInTransit, time, isInTransitNotified, progress, animationStarted]);


    // --- 主要的动画控制 Effect (原 265 行附近) ---
    useEffect(() => {
        console.log("动画控制 Effect 检查:",
            `deliveryStatus=${deliveryStatus}`,
            `routePath.length=${routePath.length}`,
            `startAnimation=${startAnimation}`,
            `animationExecuted=${animationExecutedRef.current}`
        );

        // 清理之前的 interval (防御性编程)
        if (intervalRef.current) {
            console.log("动画 Effect 开始前清理旧 interval");
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // 条件：状态是 Shipped, 有路径, 收到开始信号, 且本次动画未执行完成
        if (deliveryStatus === ShippingStatus.ShippingShipped &&
            routePath.length > 0 &&
            startAnimation &&
            !animationExecutedRef.current)
        {
            console.log("条件满足，启动动画 interval");

            let currentStep = 0; // 使用局部变量跟踪步数
            const totalSteps = routePath.length - 1;

            if (totalSteps <= 0) {
                console.warn("路径点不足，无法执行动画");
                return; // 退出 effect
            }

            // 重置状态到起点
            setCurrentPosition(routePath[0]);
            setProgress(0);
            setIsInTransitNotified(false); // 重置运输中通知状态

            console.log(`启动动画 interval，总步数: ${totalSteps}, 总时间: ${time}ms`);

            intervalRef.current = setInterval(() => {
                currentStep++;
                // 更新位置状态
                setCurrentPosition(routePath[currentStep]);
                // 更新进度状态 (用于UI显示)
                setProgress(currentStep);

                console.log(`动画 interval 运行中，步数: ${currentStep}/${totalSteps}`);

                // 触发运输中回调 (只一次)
                if (!isInTransitNotified && currentStep >= totalSteps / 3) {
                    console.log("到达1/3路程，触发运输中回调");
                    onInTransit?.();
                    setIsInTransitNotified(true);
                }

                // 到达终点
                if (currentStep >= totalSteps) {
                    console.log("到达终点，清理 interval 并触发回调");
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    // 确保最终位置和进度正确
                    setCurrentPosition(routePath[totalSteps]);
                    setProgress(totalSteps);
                    // 标记动画已执行完成
                    animationExecutedRef.current = true;

                    // 延迟调用送达回调，给状态更新留出时间
                    setTimeout(() => {
                        console.log("调用 onDeliveryComplete 回调");
                        onDeliveryComplete(); // 调用送达回调
                    }, 100); // 短暂延迟
                }
            }, time / totalSteps); // 计算每一步的时间间隔

        } else {
            // 如果条件不满足（例如 startAnimation 变为 false，或状态不再是 Shipped），确保清理 interval
            if (intervalRef.current) {
                console.log("动画条件不满足，清理 interval");
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup function: 组件卸载或依赖项变化时清理 interval
        return () => {
            if (intervalRef.current) {
                console.log("Effect cleanup: 清理 interval");
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    // 依赖项：只包含触发动画开始/停止/重置的外部因素和必要数据
    // 移除了 progress
    }, [deliveryStatus, routePath, startAnimation, time, onInTransit, onDeliveryComplete, userPosition, sellerPosition]); // 保持关键依赖


    // --- Effect to handle setting position when delivered or path changes (原 311 行附近) ---
    // 这个 Effect 现在主要用于确保在非动画状态下的位置正确性，
    // 以及在状态重置时清理动画标记。动画完成的标记由上面的动画 Effect 处理。
    useEffect(() => {
        console.log("状态同步/重置 Effect 检查:", `deliveryStatus=${deliveryStatus}`);

        if (deliveryStatus === ShippingStatus.ShippingDelivered) {
            // 确保最终位置正确，并标记动画完成（如果尚未标记）
            if (!animationExecutedRef.current) {
                 console.log("状态为 Delivered，但动画未标记完成，强制标记");
                 animationExecutedRef.current = true;
            }
             setCurrentPosition(userPosition); // 确保位置是终点
             if (routePath.length > 0) {
                 setProgress(routePath.length - 1); // 设置进度为最大
             } else {
                 setProgress(100); // 或者其他完成值
             }
             // 清理可能残留的 interval
             if (intervalRef.current) {
                 console.log("清理因状态为 Delivered 的残留 interval");
                 clearInterval(intervalRef.current);
                 intervalRef.current = null;
             }
        } else if (deliveryStatus === ShippingStatus.ShippingPending || deliveryStatus === ShippingStatus.ShippingWaitCommand) {
            // 当状态重置为初始状态时，重置动画执行标记和通知状态
            console.log("状态重置为 Pending/WaitCommand，重置动画标记和位置");
            animationExecutedRef.current = false; // <--- 允许下次动画
            setIsInTransitNotified(false);
            setProgress(0);
            setCurrentPosition(sellerPosition); // 重置到起点
            // 清理可能存在的 interval
             if (intervalRef.current) {
                 console.log("清理因状态重置的 interval");
                 clearInterval(intervalRef.current);
                 intervalRef.current = null;
             }
        }
    // 依赖项：当 deliveryStatus 或关键位置变化时触发
    }, [deliveryStatus, userPosition, sellerPosition, routePath]); // 保持依赖


    // 开始运输按钮点击处理
    const handleStartDeliveryClick = () => {
        // ... existing code ...
        // (保持不变)
        if (deliveryStatus === ShippingStatus.ShippingPending || deliveryStatus === ShippingStatus.ShippingWaitCommand) {
            onShippingStarted?.(); // 调用发货回调，让父组件处理API调用
            // 内部状态将通过 initialShippingStatus prop 更新
            // 重置相关状态，准备动画（如果父组件成功发货）
            setIsInTransitNotified(false);
            animationExecutedRef.current = false; // 允许新动画
        }
    };

    // 计算卡车应该显示的位置
    const truckDisplayPosition = deliveryStatus === ShippingStatus.ShippingDelivered ? userPosition : currentPosition;
    // 只有在运输过程中或已送达（显示在终点）才显示卡车
    const showTruck = deliveryStatus === ShippingStatus.ShippingShipped || deliveryStatus === ShippingStatus.ShippingInTransit || deliveryStatus === ShippingStatus.ShippingDelivered;


    return (
        <div className="logistics-container">
            <div className="status-control">
                <p>支付状态：{getStatusText(paymentStatus)}</p>
                {/* 使用重命名后的函数 */}
                <p>物流状态：{getShippingStatusText(deliveryStatus)}</p>
                {/* 只有在特定状态下才显示按钮 */}
                {(deliveryStatus === ShippingStatus.ShippingPending || deliveryStatus === ShippingStatus.ShippingWaitCommand) && paymentStatus === PaymentStatus.Paid && (
                    <button onClick={handleStartDeliveryClick} disabled={isLoading}>
                        {isLoading ? '处理中...' : '模拟开始运输'}
                    </button>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>
            <MapContainer center={sellerPosition} zoom={11} style={{height: '400px', width: '100%'}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* 卖家位置 */}
                <Marker position={sellerPosition} icon={sellerIcon}>
                    <Popup>卖家位置</Popup>
                </Marker>
                {/* 用户位置 */}
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>您的位置</Popup>
                </Marker>
                {/* 运输路径 */}
                {routePath.length > 0 && <Polyline positions={routePath} color="blue"/>}
                {/* 卡车位置 - 只有在运输中或已送达时显示 */}
                {showTruck && routePath.length > 0 && (
                    <Marker position={truckDisplayPosition} icon={truckIcon}>
                        <Popup>运输中...</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LogisticsMap;
