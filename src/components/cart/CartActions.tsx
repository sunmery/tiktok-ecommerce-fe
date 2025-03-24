import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface CartActionsProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
  onClearCart: () => void;
}

const CartActions: React.FC<CartActionsProps> = ({
  onCheckout,
  onContinueShopping,
  onClearCart,
}) => {
  const { t } = useTranslation(['cart']);

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex gap-2">
        <Button onClick={onContinueShopping}>
          {t('cart:actions.continue')}
        </Button>
        <Button variant="destructive" onClick={onClearCart}>
          {t('cart:actions.clear')}
        </Button>
      </div>
      <Button onClick={onCheckout}>
        {t('cart:actions.checkout')}
      </Button>
    </div>
  );
};

export default CartActions; 