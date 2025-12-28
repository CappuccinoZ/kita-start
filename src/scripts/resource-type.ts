export interface ResourceItem {
  name: string,
  url: string,
  description?: string,
  image?: string,
  loading?: string,
  tags?: string[]
}

export interface Resource {
  name: string,
  icon?: string,
  sites: ResourceItem[]
}