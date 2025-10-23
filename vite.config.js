import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 使用 terser 进行代码压缩和混淆
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除所有 console.log
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除未使用的代码
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
      mangle: {
        // 对变量和函数名进行混淆
        toplevel: true,
      },
      format: {
        // 移除注释
        comments: false,
      },
    },
    // 启用代码分割，减小单个文件体积
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
        },
      },
    },
  },
})
