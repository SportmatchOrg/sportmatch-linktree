import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig({
  preview: {
    buckets: {
      'bug-attachments': { access: 'public_read' },
    },
  },
});
