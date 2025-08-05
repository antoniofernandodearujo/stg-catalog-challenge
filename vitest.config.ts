// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use o ambiente JSDOM para simular o comportamento de um navegador
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  // ... (outras configurações, como aliases, se você as tiver)
});