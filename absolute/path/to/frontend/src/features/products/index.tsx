const addToCartHandler = async (
    id: string,
    name: string,
    merchantId: string,
    picture: string,
) => {
    // 确保productId不为空
    if (!id || id.trim() === '') {
        console.error('添加商品失败: 商品ID不能为空');
        return;
    }

    // 确保picture有效，如果无效则使用默认图片
    const validPicture = picture && picture.trim() !== '' ? picture : '/default-product-image.png';

    // 修正参数顺序：productId, name, merchantId, picture, quantity
    cartStore.addItem(id, name, merchantId, validPicture, 1);
    showMessage('商品已添加到购物车', 'success');
}