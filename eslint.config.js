import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist/**', 'node_modules/**', '.husky/**', '*.config.{js,cjs,ts}', '.prettierrc.cjs', 'commitlint.config.cjs'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  prettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]