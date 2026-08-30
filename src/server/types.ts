export interface ResourceItem {
  name: string;
  description?: string;
  url: string;
  image?: string;
}

export interface Resource {
  name: string;
  site: ResourceItem[];
  icon?: string;
}
