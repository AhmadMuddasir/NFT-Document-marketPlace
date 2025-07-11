/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'bufferutil': 'commonjs bufferutil',
      'utf-8-validate': 'commonjs utf-8-validate',
    });
    return config;
  }
}

module.exports = nextConfig

//0x415E49eBa5854eda546CDD643e5eb6E7A2bc0E07