import React from 'react'
import { G, Path } from 'react-native-svg'
import SvgIcon from 'react-native-svg-icon'

const icons = {
  Refresh: {
    viewBox: '0 0 256 300',
    svg: (
      <G>
        <Path d="M 128 300.1C 57.3 300.1 0 242.8 0 172C 0 101.2 57.3 43.9 128 43.9L 128 0L 224 64L 128 119.7L 128 63.9C 68.4 63.9 19.9 112.4 19.9 172C 19.9 231.6 68.4 280.1 128 280.1C 187.6 280.1 236.1 232 236.1 172L 256 172C 256 243 198.7 300.1 128 300.1Z" />
      </G>
    ),
  },
}

export default props => <SvgIcon {...props} svgs={icons} />
