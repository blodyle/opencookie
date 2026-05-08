const isGitHubPages = process.env.GITHUB_PAGES === "true"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/opencookie" : undefined,
  assetPrefix: isGitHubPages ? "/opencookie/" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
