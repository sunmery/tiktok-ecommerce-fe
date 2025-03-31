import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {ProductAttributes} from '@/components/ui/ProductAttributes';
import {AttributeValue} from '@/types/products';

interface ProductItemProps {
    id: string;
    name: string;
    price: number;
    image: string;
    attributes?: Record<string, AttributeValue>;
    onAddToCart: (id: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
                                                     id,
                                                     name,
                                                     price,
                                                     image,
                                                     attributes,
                                                     onAddToCart,
                                                 }) => {
    const {t} = useTranslation();

    return (
        <div className="border rounded-lg p-4 flex flex-col">
            <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{name}</h3>
            <p className="text-gray-600 mb-4">¥{price.toFixed(2)}</p>
            {attributes && Object.keys(attributes).length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {t('product.attributes')}
                    </h4>
                    <ProductAttributes attributes={attributes}/>
                </div>
            )}
            <Button
                onClick={() => onAddToCart(id)}
                className="mt-auto"
            >
                {t('actions.add')}
            </Button>
        </div>
    );
};

export default ProductItem; 
