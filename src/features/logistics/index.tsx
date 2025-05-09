import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LogisticsMap from '@/components/LogisticsMap';
import { getCoordinatesByAddress } from '@/utils/geocoding';
import { Coordinates } from '@/types/logisticsMap';
import './index.css';
import { ShippingStatus } from "@/types/status.ts";

/**
 * 物流跟踪页面组件
 */
export default function Logistics() {
    // 状态定义
    const [sellerPosition, setSellerPosition] = useState<Coordinates | null>(null);
    const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDelivered, setIsDelivered] = useState<boolean>(false);
    const [sellerAddress, setSellerAddress] = useState<string>('北京市中心');
    const [userAddress, setUserAddress] = useState<string>('北京市朝阳区阜荣街10号');
    const {t} = useTranslation();

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
        const {t} = useTranslation();
        return <div className="loading">{t('logistics.loading')}</div>;
    }

    if (error || !sellerPosition || !userPosition) {
        return (
            <div className="error-container">
                <p>{error || t('logistics.unknownError')}</p>
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
            <h1>{t('logistics.tracking')}</h1>

            <div className="order-info">
                <h2>{t('logistics.orderInfo')}</h2>
                <p>{t('logistics.orderId')}: ORD-2023-12345</p>
                <p>{t('logistics.product')}: {t('logistics.productName')}</p>
                <div className="address-inputs">
                    <div className="address-input-group">
                        <label>{t('logistics.shippingAddress')}：</label>
                        <input
                            type="text"
                            value={sellerAddress}
                            onChange={(e) => setSellerAddress(e.target.value)}
                            placeholder="请输入发货地址"
                        />
                        <button onClick={updateCoordinates}
                                className="update-btn">{t('logistics.updateShippingAddress')}</button>
                    </div>
                    <div className="address-input-group">
                        <label>{t('logistics.deliveryAddress')}：</label>
                        <input
                            type="text"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                            placeholder="请输入收货地址"
                        />
                        <button onClick={updateCoordinates}
                                className="update-btn">{t('logistics.updateDeliveryAddress')}</button>
                    </div>
                </div>
            </div>

            <LogisticsMap
                sellerPosition={sellerPosition}
                userPosition={userPosition}
                onDeliveryComplete={handleDeliveryComplete}
                initialShippingStatus={ShippingStatus.ShippingWaitCommand}
            />

            {isDelivered && (
                <div className="delivery-notification">
                    <h3>🎉 {t('logistics.packageDelivered')}</h3>
                    <p>{t('logistics.thankYou')}</p>
                </div>
            )}
        </div>
    );
};
