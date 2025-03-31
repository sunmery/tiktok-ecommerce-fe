import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import {TanStackRouterVite} from '@tanstack/router-plugin/vite';
import {resolve} from 'path';

export default defineConfig(({command}) => {
    if (command === 'serve') {
        // 开发配置
        return {
            plugins: [
                TanStackRouterVite(),
                react(),
                basicSsl({
                    name: 'localhost',
                    certDir: './ssl',
                    domains: ['localhost', '127.0.0.1'],
                }),
            ],
            server: {
                port: 3000,
                strictPort: true,
                cors: true,
                http2: true,
                // certfile: './ssl/gateway.crt',
                // keyfile: './ssl/gateway.key',
                https: { // 正确配置为ServerOptions
                    maxVersion: 'TLSv1.3',
                    ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256'
                },
            },
            resolve: {
                alias: {'@': resolve(__dirname, 'src/')},
            },
        };
    } else {
        // 生产配置
        return {
            plugins: [react()],
            resolve: {
                alias: {'@': resolve(__dirname, 'src/')},
            },
            base: './',
            mode: 'production',
            assetsDir: 'public',
            chunkSizeWarningLimit: 1500,
            minify: 'esbuild',
            outDir: 'dist',
            reportCompressedSize: false,
            sourcemap: false,
            target: 'esnext',
            // 日志级别
            logLevel: 'info',
            // 是否清除屏幕
            clearScreen: false,
            // https://cn.vitejs.dev/config/build-options.html#build-terseroptions
            terserOptions: {
                compress: {
                    // 生产环境时移除console
                    drop_console: false,
                    // 生产环境时移除debugger
                    drop_debugger: false,
                },
            },
            rollupOptions: {
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
        };
    }
});
