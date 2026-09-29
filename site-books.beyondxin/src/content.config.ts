import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

// 直接读取根仓库的 MyNote 子模块，不再依赖 src/content/posts 符号链接
// （该 symlink 未被 git 跟踪，CI checkout 后不存在）
// 注意：base 相对于项目根（site-books.beyondxin），只需一层 ..
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: '../MyNote/读书笔记' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      modDate: z.coerce.date().optional(),
      categories: z.array(z.string()).default([]),
      draft: z.boolean().default(false).optional(),
      description: z.string().optional(),
      customData: z.string().optional(),
      banner: image()
        .refine(img => Math.max(img.width, img.height) <= 4096, { message: 'Width and height of the banner must less than 4096 pixels' })
        .optional(),
      author: z.string().optional(),
      commentsUrl: z.string().optional(),
      source: z.optional(z.object({ url: z.string(), title: z.string() })),
      enclosure: z.optional(z.object({ url: z.string(), length: z.number(), type: z.string() })),
      pin: z.boolean().default(false).optional(),
    }),
})

const spec = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/spec' }),
})

export const collections = {
  posts,
  spec,
}
