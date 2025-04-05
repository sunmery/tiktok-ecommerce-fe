// 使用MUI的Alert组件来实现消息提示
export const showMessage = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    // 由于这是一个工具函数，不在React组件内部，无法直接使用useAlert hook
    // 我们将消息发送到控制台，同时触发一个自定义事件，让AlertProvider可以捕获并显示
    console.log(`${type}: ${message}`)

    // 处理错误消息，确保显示友好的错误信息
    let displayMessage = message;

    // 如果是网络错误，提供更友好的提示
    if (message.includes('Failed to fetch')) {
        displayMessage = '网络连接失败，请检查您的网络连接';
    }

    // 创建一个自定义事件，携带消息内容和类型
    const event = new CustomEvent('show-alert', {
        detail: {
            message: displayMessage,
            type
        }
    })

    // 分发事件，让AlertProvider可以捕获
    window.dispatchEvent(event)
}
