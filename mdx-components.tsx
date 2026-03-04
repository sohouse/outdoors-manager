import type { MDXComponents } from 'mdx/types'
// 定义全局 MDX Components
//  在 App Router 中使用 @next/mdx 时，mdx-components.tsx 是必需的，没有它将无法工作。
const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
    return components
}