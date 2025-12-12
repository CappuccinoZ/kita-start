let resource = []

function getIconUrl(url) {
  return `https://${url.split('/')[2]}/favicon.ico`
}

for (let i = 0; i < resource.length; i++) {
  const sites = resource[i].sites
  for (let j = 0; j < sites.length; j++) {
    if (sites[j].image === undefined) {
      sites[j].image = getIconUrl(sites[j].url)
    }
  }
}

console.log(JSON.stringify(resource))