import React from 'react'
import { connect } from 'react-refetch'

const Fetch = ({ component, func, loading, error, url, ...otherProps }) =>
  React.createElement(
    connect(func)(({ fetch }) => {
      if (fetch.pending) {
        return loading
      } else if (fetch.rejected) {
        return error(fetch.reason)
      } else if (fetch.fulfilled) {
        return React.createElement(component, { ...fetch.value, ...otherProps })
      }
    }),
    { url }
  )

export default Fetch
