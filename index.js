
addEventListener('fetch', event => {
  console.log(event)
  var url = new URL(event.request.url)

  if (url.pathname.startsWith('/links')) {
    event.respondWith(handleRequestForLinks(event.request))
  } else {
    event.respondWith(handleRequestForOthers(event.request))
  }
})

var links = [
  { name: 'Twitter', url: 'https://twitter.com/Obinnaspeaks' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ekwunoobinna/' },
  { name: 'Website', url: 'https://www.obinnaspeaks.dev/' },
]

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    // Your code
    for (let link of links) {
      element.append(`<a href="${link.url}"> ${link.name}</a>`, { html: true })
    }
  }
}

class ProfileTransformer {
  async element(element) {
    // Your code
    element.removeAttribute('style')
  }
}

class AttributeTransformer {
  constructor(attr,value){
    this.attr = attr ;
    this.value = value
  }
  async element(element) {
    // Your code
    element.setAttribute(
      this.attr,
      this.value,
    )
  }
}

class TextTransformer {
  constructor(name){
    this.name = name
  }
  async element(element) {
    // Your code
    element.prepend(
      this.name
    )
  }
}

class BodyTransformer {
  constructor(name){
    this.name = name
  }
  async element(element) {
    // Your code
    element.prepend(
      this.name
    )
  }
}

//add svgs here
var svgs = [
  { svg: 'twitter svg', url: 'https://res.cloudinary.com/ekwuno/image/upload/v1613611969/twitter.svg' },
  { svg: 'LinkedIn svg', url: 'https://res.cloudinary.com/ekwuno/image/upload/v1613612188/linkedin.svg' },
  { svg: 'web svg', url: 'https://linkurl' },
]
class SocialTransformer {
  async element(element) {
    // Your code
    element.removeAttribute('style')

    for (let svg of svgs) {
      element.append(`<a href="${svg.url}"><svg>${svg.svg}</svg></a>`, { html: true })
    }
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequestForLinks(request) {
  const json = JSON.stringify(links, null, 2)
  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}

async function handleRequestForOthers(request) {
  // call a fetch request
  const html = await fetch('https://static-links-page.signalnerve.workers.dev')
  // new HTMLRewriter().on("div#links", new LinksTransformer(links)).transform(html)
  // console.log(new HTMLRewriter().on("div#links", new LinksTransformer(links)).transform(html));
  var rewrter = new HTMLRewriter()
    .on('div#links', new LinksTransformer(links))
    .on('div#profile', new ProfileTransformer())
    .on('img#avatar', new AttributeTransformer('src', 'https://res.cloudinary.com/ekwuno/image/upload/v1597065308/obinna_speaks_Ekwuno.jpg'))
    .on('h1#name', new TextTransformer("obinnacodes"))
    .on('div#social', new SocialTransformer())
    .on('title' , new TextTransformer("Obinna Ekwuno"))
    .on('body', new AttributeTransformer('class', 'bg-red-400'))
    .transform(html)
  return new Response(rewrter.body, {
    headers: { 'content-type': 'text/html' },
  })
}
