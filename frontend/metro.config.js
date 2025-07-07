const { getDefaultConfig } = require('@expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

// make sure Metro can resolve .cjs files…
defaultConfig.resolver.sourceExts.push('cjs');
// …and disable the new exports-only resolution so Firebase’s internals register properly
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
