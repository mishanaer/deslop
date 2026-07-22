module.exports = {
  key: process.env.RELATIVE_CI_KEY,
  webpack: {
    stats: './build/webpack-stats.json',
  },
};
