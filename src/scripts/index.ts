import resourceJson from '../data/resource.json'

export interface ResourceItem {
  name: string,
  url: string,
  description?: string,
  image?: string,
  tags?: string[]
}

export interface Resource {
  name: string,
  icon?: string,
  sites: ResourceItem[]
}

export const resources = resourceJson as Resource[]
export const categories = [] as string[]
resources.forEach((resource) => {
  if (!categories.includes(resource.name)) {
    categories.push(resource.name)
  }
})
