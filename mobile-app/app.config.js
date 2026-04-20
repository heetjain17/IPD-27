/** @type {import('@expo/config').ConfigContext} */
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      'react-native-maps',
      {
        googleMapsApiKey: process.env.GOOGLE_API_KEY ?? '',
      },
    ],
  ],
});
