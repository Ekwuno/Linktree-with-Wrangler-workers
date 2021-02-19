var links = [
  { name: 'Twitter', url: 'https://twitter.com/Obinnaspeaks' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ekwunoobinna/' },
  { name: 'Website', url: 'https://www.obinnaspeaks.dev/' },
]

addEventListener('fetch', event => {
  var url = new URL(event.request.url)

  if (url.pathname.startsWith('/links')) {
    event.respondWith(handleRequestForLinks(event.request))
  } else {
    event.respondWith(handleRequestForOthers(event.request))
  }
})

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    for (let link of links) {
      element.append(`<a href="${link.url}"> ${link.name}</a>`, { html: true })
    }
  }
}

class ProfileTransformer {
  async element(element) {
    element.removeAttribute('style')
  }
}

class AttributeTransformer {
  constructor(attr, value) {
    this.attr = attr
    this.value = value
  }
  async element(element) {
    element.setAttribute(this.attr, this.value)
  }
}

class TextTransformer {
  constructor(name) {
    this.name = name
  }
  async element(element) {
    element.prepend(this.name)
  }
}

class SetTransformer {
  constructor(name) {
    this.name = name
  }
  async element(element) {
    element.setInnerContent(this.name)
  }
}

class BodyTransformer {
  constructor(name) {
    this.name = name
  }
  async element(element) {
    element.prepend(this.name)
  }
}

//add svgs here
var svgs = [
  {
    name: '/sVG/twitter svg 2.0.svg',
    link: 'https://twitter.com/Obinnaspeaks',
    svg:
      '<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Twitter icon</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
  },
  {
    name: 'LinkedIn svg',
    link: 'https://www.linkedin.com/in/ekwunoobinna/',
    svg:
      '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn icon</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  },
  {
    name: 'web svg',
    link: 'https://www.obinnaspeaks.dev/',
    svg:
      '<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Google Scholar icon</title><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>',
  },
]
class SocialTransformer {
  constructor(svgs) {
    this.svgs = svgs
  }

  async element(element) {
    for (let svg of svgs) {
      element.append(`<a href="${svg.link}"> ${svg.svg} </a>`, { html: true })
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
  const html = await fetch('https://static-links-page.signalnerve.workers.dev')
  var rewrter = new HTMLRewriter()
    .on('div#links', new LinksTransformer(links))
    .on('div#profile', new ProfileTransformer())
    .on(
      'img#avatar',
      new AttributeTransformer(
        'src',
        'https://res.cloudinary.com/ekwuno/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1611487810/IMG_6312.jpg',
      ),
    )
    .on('h1#name', new TextTransformer('obinnacodes'))
    .on('div#social', new SocialTransformer(svgs))
    .on('div#social', new ProfileTransformer())
    .on('title', new SetTransformer('Obinna Ekwuno'))
    .on('body', new AttributeTransformer('class', 'bg-red-400'))
    .transform(html)
  return new Response(rewrter.body, {
    headers: { 'content-type': 'text/html' },
  })
}
