/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/images",
          outputPath: "static/images/",
        },
      },
    })
    config.externals = [...config.externals, { canvas: "canvas" }]
    return config
  },
}

module.exports = nextConfig

