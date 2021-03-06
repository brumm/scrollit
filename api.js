import { connect } from 'react-refetch'
import URL from 'url-parse'

const SUPPORTED_DOMAINS = [
  'i.imgur.com',
  'imgur.com',
  'i.redd.it',
  'v.redd.it',
  'gfycat.com',
  'giant.gfycat.com',
]
const fixRedditUrl = url => url.replace(/&amp;/g, '&')
const imgurIdRegex = /com(?:\/(?:a|gallery))?\/([a-zA-Z0-9]{5,7})/
const isGifRegex = /\.gifv?/

const transform = (post, isVideo) => {
  switch (post.domain) {
    case 'giant.gfycat.com':
    case 'gfycat.com':
      return {
        small: fixRedditUrl(post.preview.images[0].resolutions[0].url),
        large: fixRedditUrl(post.preview.images[0].variants.mp4.source.url),
        type: 'video',
      }

    case 'v.redd.it':
      if (post.media) {
        return {
          small: fixRedditUrl(post.preview.images[0].resolutions[0].url),
          large: fixRedditUrl(post.media.reddit_video.fallback_url),
          type: 'video',
        }
      }

    case 'i.redd.it':
      if (post.preview) {
        if (isVideo) {
          return {
            small: fixRedditUrl(post.preview.images[0].resolutions[0].url),
            large: fixRedditUrl(post.preview.images[0].variants.mp4.source.url),
            type: 'video',
          }
        } else {
          return {
            small: fixRedditUrl(post.preview.images[0].resolutions[0].url),
            large: fixRedditUrl(post.preview.images[0].source.url),
            type: 'image',
          }
        }
      } else {
        return {
          small: post.url,
          large: post.url,
          type: 'image',
        }
      }

    case 'imgur.com':
    case 'i.imgur.com':
      const id = imgurIdRegex.exec(post.url)[1]
      if (id.length === 5) {
        return {
          id,
          type: 'album',
        }
      } else {
        if (isVideo) {
          return {
            id,
            small: `https://i.imgur.com/${id}t.png`,
            large: `https://i.imgur.com/${id}.mp4`,
            type: 'video',
          }
        } else {
          return {
            id,
            small: `https://i.imgur.com/${id}t.png`,
            large: `https://i.imgur.com/${id}l.png`,
            type: 'image',
          }
        }
      }

    default:
      return {}
  }
}

export const subredditFetch = ({ url }) => ({
  fetch: {
    url,
    then: ({ data: { children, after } }) => ({
      value: {
        after,
        posts: children
          .map(({ data }) => data)
          .filter(({ domain }) => SUPPORTED_DOMAINS.includes(domain))
          .map(post => {
            const { id, domain, url, title, author, subreddit } = post
            const { origin, pathname } = new URL(url)

            let media = {}
            if (__DEV__) {
              try {
                media = transform(post, isGifRegex.test(url))
              } catch (error) {
                console.error('post transform failed', { post, error })
              }
            } else {
              media = transform(post, isGifRegex.test(url))
            }

            return {
              id,
              url: origin + pathname,
              title,
              author,
              subreddit,
              media,
            }
          }),
      },
    }),
    headers: { Accept: undefined, 'Content-Type': undefined },
  },
})

export const albumFetch = connect(({ id }) => ({
  albumFetch: {
    url: `https://api.imgur.com/3/album/${id}`,
    then: ({ data }) => ({
      value: {
        images: data.images,
      },
    }),
    headers: {
      Authorization: 'Client-ID 5fc5e13abb00925',
    },
  },
}))
