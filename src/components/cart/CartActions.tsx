import {useTranslation} from 'react-i18next';
import {Button, ButtonProps} from '@mui/joy';

interface CartActionsProps {
    onCheckout: () => void;
    onContinueShopping: () => void;
    isDisabled: boolean;
    continueButtonProps?: ButtonProps;
    checkoutButtonProps?: ButtonProps;
}

/**
 * 购物车操作按钮组件
 * 包含继续购物和结算按钮
 */
const CartActions: React.FC<CartActionsProps> = ({onCheckout, onContinueShopping, isDisabled, continueButtonProps, checkoutButtonProps}) => {
    const {t} = useTranslation();

    return (
        <div className="flex justify-between mt-4">
            <Button
                variant="outlined"
                color="neutral"
                onClick={onContinueShopping}
                {...continueButtonProps}
            >
                {t('continueShopping')}
            </Button>
            <Button
                variant="solid"
                color="primary"
                disabled={isDisabled}
                onClick={onCheckout}
                {...checkoutButtonProps}
            >
                {t('checkout')}
            </Button>
        </div>
    );
};

export default CartActions; 
