import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'monaco': ['@monaco-editor/react', 'monaco-editor'],
                    'vendor': ['react', 'react-dom', 'react-router-dom'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        port: 3000,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
    },
});