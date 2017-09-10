import React from 'react'
import { ActionSheetIOS } from 'react-native'
import { TouchableWithoutFeedback as Touch } from 'react-native'

export const shareUrl = url =>
  ActionSheetIOS.showShareActionSheetWithOptions({ url }, console.error, console.log)

export const by = (sortOrder, getKey) => (itemA, itemB) =>
  sortOrder.indexOf(getKey(itemA)) < sortOrder.indexOf(getKey(itemB)) ? -1 : 1

export const toggleOverflow = Component =>
  class extends React.Component {
    toggle = () => {
      this.props.onChange(!this.props.isOpen)
    }

    render() {
      const { minLines = 2, maxLines = 0, isOpen } = this.props
      return (
        <Touch onPress={this.toggle}>
          <Component {...this.props} numberOfLines={isOpen ? maxLines : minLines} />
        </Touch>
      )
    }
  }
