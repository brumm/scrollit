import React from 'react'
import { connect } from 'react-refetch'

export default class Fetch extends React.Component {
  componentWillUpdate(nextProps, nextState) {
    this.props.didNavigate && this.props.didNavigate()
  }

  shouldComponentUpdate({ url }) {
    return url !== this.props.url
  }

  render() {
    const { component, func, loading, error, url, didNavigate, ...otherProps } = this.props
    return React.createElement(
      connect(func)(({ fetch }) => {
        if (fetch.pending) {
          return loading
        } else if (fetch.rejected) {
          return error(fetch.reason)
        } else if (fetch.fulfilled) {
          return React.createElement(component, {
            ...fetch.value,
            ...otherProps,
          })
        }
      }),
      { url }
    )
  }
}
