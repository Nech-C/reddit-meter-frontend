import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  { ignores: ['package.json', 'dist/**', '**/.*'] },
  { files: ['**/*.{js,mjs,cjs,jsx}'], plugins: { js, stylistic }, extends: ['js/recommended', 'stylistic/recommended'], languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
])
