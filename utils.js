import React from 'react'
import { ActionSheetIOS } from 'react-native'
import { TouchableWithoutFeedback as Touch } from 'react-native'

export const shareUrl = url =>
  ActionSheetIOS.showShareActionSheetWithOptions({ url }, console.error, console.log)

export const by = (sortOrder, getKey) => (itemA, itemB) =>
  sortOrder.indexOf(getKey(itemA)) < sortOrder.indexOf(getKey(itemB)) ? -1 : 1

export const toggleOverflow = (Component, { minLines = 2, maxLines = 0 } = {}) =>
  class extends React.Component {
    state = { isOpen: false }

    toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }))

    render() {
      return (
        <Touch onPress={this.toggle}>
          <Component {...this.props} numberOfLines={this.state.isOpen ? maxLines : minLines} />
        </Touch>
      )
    }
  }
