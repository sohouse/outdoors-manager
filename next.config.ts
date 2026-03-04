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
  options: {
    remarkPlugins: [],
    rehypePlugins: [['rehype-prism-plus', { showLineNumbers: true }] as any],
  },
})

export default withMDX(nextConfig);
