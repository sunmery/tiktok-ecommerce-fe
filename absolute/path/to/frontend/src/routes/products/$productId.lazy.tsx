const addToCartHandler = () => {
    if (data) {
        try {
            const imageUrl = data.images[0].url ? data.images[0].url : '';
            cartStore.addItem(
                data.id as string,
                data.name as string,
                data.merchantId as string,
                imageUrl,
                1
            );
        } catch (error) {
            console.error('添加到购物车失败:', error);
            showMessage('添加到购物车失败，请稍后重试', 'error');
        }
    }
}