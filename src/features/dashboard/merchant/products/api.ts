import { GetMerchantProductsReq } from "./types.ts";
import { httpClient } from "@/utils/http-client.ts";
import { Products } from "@/features/products/types.ts";

export const merchantProductService = {
    /**
     * 获取商家商品列表
     * GET /v1/merchants/products
     */
    getMerchantProducts: (params?: GetMerchantProductsReq) => {
        return httpClient.get<Products>(`${import.meta.env.VITE_MERCHANTS_URL}/products`, {
            params
        });
    }
}
