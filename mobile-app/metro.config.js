const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Allow Metro to resolve .mjs ES module files (required by @tabler/icons-react-native)
config.resolver.sourceExts.push('mjs');

module.exports = withNativeWind(config, { input: './global.css' });
