module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          'react-native-reanimated/plugin' // Add Reanimated plugin here
        ],
      },
    },
    plugins: ['react-native-reanimated/plugin'], // Ensure this is added for all environments
  };
};
