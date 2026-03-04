import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  // 根据需要在此处添加 markdown 插件
  extension: /\.(md|mdx)$/,
})

export default withMDX(nextConfig);
