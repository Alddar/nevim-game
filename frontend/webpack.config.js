module.exports = {
  module: {
    rules: [
      {
        test: /\.pcss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-easy-import'),
                  require('postcss-url'),
                  require('tailwindcss'),
                  require('autoprefixer')
                ],
              },
            },
          }
        ]

      },
    ],
  },
}
