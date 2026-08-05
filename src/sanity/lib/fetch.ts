import 'server-only'
import { draftMode } from 'next/headers'
import { client } from './client'
import type { QueryParams } from 'next-sanity'

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  const { isEnabled } = await draftMode()

  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: isEnabled ? 0 : 3600, // Revalidate every hour, or bypass cache if in draft mode
      tags,
    },
    perspective: isEnabled ? 'previewDrafts' : 'published',
    stega: isEnabled, // Enable Stega for visual editing only in draft mode
  })
}
