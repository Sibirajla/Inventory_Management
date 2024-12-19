import { defineConfig } from 'vite';

export default defineConfig({
  // other configurations
  build: {
    sourcemap: false, // disable source maps for production
    rollupOptions: {
      plugins: [
        {
          name: 'replace-vue-feature-flag',
          transform(code) {
            return code.replace(/__VUE_PROD_HYDRATION_MISMATCH_DETAILS__\s*=\s*false/g, '');
          },
        },
      ],
    },
  },
});
