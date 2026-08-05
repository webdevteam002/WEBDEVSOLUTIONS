import { groq } from 'next-sanity'

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    description,
    techStack,
    order
  }
`

export const projectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    category,
    tech,
    link,
    "imageUrl": image.asset->url
  }
`
