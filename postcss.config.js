export default {
  plugins: {
    autoprefixer: {
      // 强制保留所有标准属性，即使有前缀版本
      overrideBrowserslist: [
        'last 4 versions',
        '> 1%',
        'not dead',
      ],
      // 确保不会移除标准属性
      grid: 'autoplace',
    },
  },
}
