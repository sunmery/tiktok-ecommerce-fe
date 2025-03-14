import {defineConfig, HmrOptions} from 'vite'
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert'
import basicSsl from '@vitejs/plugin-basic-ssl'
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'
import {resolve} from 'path'

/**
 * @returns
 */
export default defineConfig(({command}) => {
    if (command === 'serve') {
        return {
            // dev 独有配置
            plugins: [
                TanStackRouterVite(),
                react(),
                basicSsl({
                    name: 'localhost',          // 证书名称
                    certDir: './src/ssl',           // 证书存放目录（相对项目根目录）
                    domains: ['localhost', '127.0.0.1'],  // 支持的域名
                    // certFileName: '_cert.pem',     // 证书文件名
                    // keyFileName: '_cert.pem'       // 密钥文件名（在同一个文件中）
                })

            ],

            server: {
                host: 'localhost',
                port: 3000,
                strictPort: false,
                cors: true,
                https: false,
                proxy: {
                    '/ecommerce.product.v1.ProductService': {
                        target: 'http://localhost:8080',
                        changeOrigin: true,
                        secure: false,
                    }
                },
                // plugins: [
                //     mkcert({
                //         hosts: ["127.0.0.1", "localhost"],
                //         // mkcertPath: "ssl",
                //         // certFileName: 'cert.pem',
                //         // keyFileName: 'key.pem'
                //     })
                // ]
            },
            resolve: {
                alias: {
                    '@': resolve(__dirname, 'src/'),
                },
            },
        }
    } else {
        return {
            plugins: [
                react(),
                // basicSsl({
                //     /** name of certification */
                //     // name: 'test',
                //     /** custom trust domains */
                //     // domains: ['*.local.com'],
                //     /** custom certification directory */
                //     //certDir: '/Users/.../.devServer/cert',
                // }),
            ],
            // build 独有配置
            // 开发或生产环境服务的公共基础路径。合法的值包括以下几种：
            // 绝对 URL 路径名，例如 /foo/
            // 完整的 URL，例如 https://foo.com/（原始的部分在开发环境中不会被使用）
            // 空字符串或 ./（用于嵌入形式的开发）
            resolve: {
                alias: {
                    '@': resolve(__dirname, 'src/'),
                },
            },
            base: './',
            mode: 'production',
            server: {
                host: '0.0.0.0',
                port: 443,
                https: true,
                strictPort: true,
                hmr: {
                    webSocketServer: false
                } as HmrOptions
            },
            assetsDir: 'public',
            chunkSizeWarningLimit: 1500,
            // 配置打包文件路径和命名
            minify: 'esbuild',
            outDir: 'dist',
            // 取消计算文件大小，加快打包速度
            reportCompressedSize: false,
            sourcemap: false,
            target: 'esnext',
            terserOptions: {
                compress: {
                    // 生产环境时移除console.log调试代码
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            rollupOptions: {
                // // 打包时忽略某些包，避免打包时间过长
                // 				external: ['react'],
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom'],
                        'ui-core-vendor': ['@mui/material', '@mui/joy'],
                        'ui-emotion-vendor': ['@emotion/react', '@emotion/styled'],
                        'router-vendor': ['@tanstack/react-router'],
                        'i18n-vendor': ['i18next', 'react-i18next'],
                        'state-vendor': ['valtio'],
                        'utils-vendor': ['lodash', 'axios']
                    }
                }
            },
        }
    }
})
