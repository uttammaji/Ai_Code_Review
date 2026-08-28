import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'monaco': ['@monaco-editor/react', 'monaco-editor'],
                    'vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui': ['lucide-react', 'motion', 'recharts'],
                    'zustand': ['zustand'],
                },
            },
        },
        target: 'es2020',
        chunkSizeWarningLimit: 1000,
    },
    server: {
        port: 3000,
        open: true,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
    },
});