module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 确保 Tailwind 扫描你的 Vue 文件
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b'
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
        'button': '4px'
      }
    },
  },
  plugins: [],
}