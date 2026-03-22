import { createClient } from 'next-sanity'
import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url'
 
export const client = createClient({
  projectId: 'tj1py70w',
  dataset: 'production',
  apiVersion: '2026-03-14',
  useCdn: true,
})
 
const builder = createImageUrlBuilder(client)
 
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}