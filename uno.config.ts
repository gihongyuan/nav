import {
  defineConfig,
  presetUno,
  presetIcons,
  presetAttributify,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.1,
      cdn: 'https://esm.sh/',
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      surface: 'var(--color-surface)',
      'surface-strong': 'var(--color-surface-strong)',
      border: 'var(--color-border)',
      text: 'var(--color-text)',
      'text-sub': 'var(--color-text-sub)',
      'text-on-image': 'var(--color-text-on-image)',
      accent: 'var(--color-accent)',
      'accent-hover': 'var(--color-accent-hover)',
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      pill: 'var(--radius-pill)',
    },
    boxShadow: {
      '1': 'var(--shadow-1)',
      '2': 'var(--shadow-2)',
      '3': 'var(--shadow-3)',
    },
    fontFamily: {
      sans: 'var(--font-sans)',
    },
    fontSize: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      display: 'var(--text-display)',
    },
    fontWeight: {
      light: 'var(--font-weight-light)',
      regular: 'var(--font-weight-regular)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
    },
    lineHeight: {
      none: 'var(--leading-none)',
      tight: 'var(--leading-tight)',
      normal: 'var(--leading-normal)',
    },
    letterSpacing: {
      tight: 'var(--tracking-tight)',
    },
  },
  shortcuts: {
    'glass-panel': 'bg-surface backdrop-blur-md border border-border shadow-1',
    'glass-panel-strong': 'bg-surface-strong backdrop-blur-md border border-border shadow-2',
  },
})
