import { ProductStatus } from "@/types/products";
import { t } from "i18next";

// 商品状态
export const translateProductStatus = (status: ProductStatus): string => {
    switch (status) {
        case ProductStatus.PRODUCT_STATUS_DRAFT:
            return t('products.status.draft');
        case ProductStatus.PRODUCT_STATUS_PENDING:
            return t('products.status.pending');
        case ProductStatus.PRODUCT_STATUS_APPROVED:
            return t('products.status.approved');
        case ProductStatus.PRODUCT_STATUS_REJECTED:
            return t('products.status.rejected');
        case ProductStatus.PRODUCT_STATUS_SOLD_OUT:
            return t('products.status.soldOut');
        default:
            return t('products.status.unknown', {status});
    }
}
