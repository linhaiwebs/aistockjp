import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Loading mode configuration - for PHP cloaking mode
// This builds the app with root path (/) instead of /index/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom', 'scheduler'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist-loading',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('docx') || id.includes('file-saver')) {
              return 'vendor-utils';
            }
          }
          if (id.includes('src/pages/AdminDashboard')) {
            return 'admin';
          }
          if (id.includes('src/pages/')) {
            return 'pages';
          }
          if (id.includes('src/components/')) {
            return 'components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  define: {
    'import.meta.env.VITE_LOADING_MODE': JSON.stringify('true'),
  },
});
