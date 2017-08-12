import { connect } from 'react-refetch'
import URL from 'url-parse'

const SUPPORTED_DOMAINS = ['i.imgur.com', 'imgur.com', 'i.redd.it']

export const subredditFetch = ({ url }) => ({
  fetch: {
    url,
    then: ({ data: { children, after } }) => ({
      value: {
        after,
        posts: children
          .filter(({ data: { domain } }) => SUPPORTED_DOMAINS.includes(domain))
          .map(({ data }) => {
            if (data.domain.includes('i.redd.it')) {
              return data
            } else {
              let url = data.url.replace(/gifv?/, 'mp4')
              const { origin, pathname } = new URL(url)
              url = origin + pathname
              let thingId
              try {
                thingId = /com(?:\/(?:a|gallery))?\/([a-zA-Z0-9]{5,7})/.exec(url)[1]
              } catch (e) {
                console.log(`parse failed for url ${data.url}`)
                throw new Error(`parse failed for url ${data.url}`)
              }

              const isAlbum = thingId.length === 5
              const isVideo = url.includes('mp4')

              return {
                ...data,
                url,
                thingId,
                isAlbum,
                isVideo,
                isImgur: true,
              }
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
        images: data.images
      },
    }),
    headers: {
      Authorization: 'Client-ID 5fc5e13abb00925',
    },
  },
}))
