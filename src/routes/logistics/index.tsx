import {createFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react';
import LogisticsMap from '@/components/LogisticsMap';
import {getCoordinatesByAddress} from '@/utils/geocoding';
import {Coordinates} from '@/types/logisticsMap';
import './index.css';

export const Route = createFileRoute('/logistics/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <LogisticsPage/>
}

/**
 * 物流跟踪页面组件
 */
const LogisticsPage = () => {
    // 状态定义
    const [sellerPosition, setSellerPosition] = useState<Coordinates | null>(null);
    const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDelivered, setIsDelivered] = useState<boolean>(false);
    const [sellerAddress, setSellerAddress] = useState<string>('北京市中心');
    const [userAddress, setUserAddress] = useState<string>('北京市朝阳区阜荣街10号');

    const fetchCoordinates = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // 获取商家地址的坐标
            const sellerCoords = await getCoordinatesByAddress(sellerAddress);
            // 获取用户地址的坐标
            const userCoords = await getCoordinatesByAddress(userAddress);
            setSellerPosition(sellerCoords);
            setUserPosition(userCoords);
        } catch (err) {
            console.error('获取坐标失败:', err);
            setError('无法获取地址坐标，请稍后再试');
            // 使用默认坐标作为备用
            setSellerPosition([39.9042, 116.4074]); // 北京市中心
            setUserPosition([39.9522, 116.4278]); // 北京东城区
        } finally {
            setIsLoading(false);
        }
    };

    const updateCoordinates = async () => {
        await fetchCoordinates();
    };

    useEffect(() => {
        fetchCoordinates();
    }, []);

    const handleDeliveryComplete = () => {
        setIsDelivered(true);
    };

    if (isLoading) {
        return <div className="loading">正在加载地址信息...</div>;
    }

    if (error || !sellerPosition || !userPosition) {
        return (
            <div className="error-container">
                <p>{error || '发生未知错误'}</p>
                {sellerPosition && userPosition && (
                    <button onClick={() => setError(null)}>
                        使用默认坐标继续
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="logistics-page">
            <h1>物流跟踪</h1>

            <div className="order-info">
                <h2>订单信息</h2>
                <p>订单号: ORD-2023-12345</p>
                <p>商品: 高级商品套装</p>
                <div className="address-inputs">
                    <div className="address-input-group">
                        <label>发货地址：</label>
                        <input
                            type="text"
                            value={sellerAddress}
                            onChange={(e) => setSellerAddress(e.target.value)}
                            placeholder="请输入发货地址"
                        />
                        <button onClick={updateCoordinates} className="update-btn">更新发货地址</button>
                    </div>
                    <div className="address-input-group">
                        <label>收货地址：</label>
                        <input
                            type="text"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                            placeholder="请输入收货地址"
                        />
                        <button onClick={updateCoordinates} className="update-btn">更新收货地址</button>
                    </div>
                </div>
            </div>

            <LogisticsMap
                sellerPosition={sellerPosition}
                userPosition={userPosition}
                onDeliveryComplete={handleDeliveryComplete}
            />

            {isDelivered && (
                <div className="delivery-notification">
                    <h3>🎉 您的包裹已送达!</h3>
                    <p>感谢您的购买，希望您对我们的服务满意。</p>
                </div>
            )}
        </div>
    );
};

