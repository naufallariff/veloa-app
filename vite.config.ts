import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: {
        target: 'es2022',
        sourcemap: false,
        chunkSizeWarningLimit: 600,
        rolldownOptions: {
            output: {
                // Memisahkan library pihak ketiga agar bundle utama ringan & caching optimal
                codeSplitting: {
                    groups: [
                        {
                            name: 'vendor-react',
                            test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                            priority: 20,
                        },
                        {
                            name: 'vendor-icons',
                            test: /node_modules[\\/]lucide-react[\\/]/,
                            priority: 15,
                        },
                        {
                            name: 'vendor',
                            test: /node_modules[\\/]/,
                            priority: 10,
                        },
                    ],
                },
            },
        },
    },
});