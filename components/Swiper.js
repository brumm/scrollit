import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import glamorous from 'glamorous-native'

const Text = glamorous.text({
  color: '#fafafa'
})

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

const between = (number, min, max) => number >= min && number <= max
const MIN_PULLUP_DISTANCE = -75

export default class Swipe extends React.Component {
  static defaultProps = {
    horizontal: false,
    onChange: () => {},
  }

  state = {
    currentIndex: 0,
    readyToRefresh: false,
    refreshing: false,
    stickAt: 0,
  }

  componentDidMount() {
    this.props.onChange(this.props.items[this.state.currentIndex])
  }

  captureRef = flatListInstance => {
    if (flatListInstance) {
      this.ListRef = flatListInstance._listRef._scrollRef
    }
  }

  getItemLayout = (data, index) => ({
    length: this.props.horizontal ? ITEM_WIDTH : ITEM_HEIGHT,
    offset: this.props.horizontal ? ITEM_WIDTH : ITEM_HEIGHT * index,
    index,
  })

  onScroll = ({ nativeEvent }) => {
    const { horizontal, onRefresh } = this.props
    const contentOffset = nativeEvent.contentOffset[horizontal ? 'x' : 'y']
    const contentSize = nativeEvent.contentSize[horizontal ? 'width' : 'height']
    const viewSize = nativeEvent.layoutMeasurement[horizontal ? 'width' : 'height']
    const pullUpDistance = contentSize - (contentOffset + viewSize)
    const currentIndex = Math.round(contentOffset / viewSize)

    if (onRefresh) {
      this.setState({
        readyToRefresh: pullUpDistance <= MIN_PULLUP_DISTANCE,
        stickAt: (contentSize - viewSize) - MIN_PULLUP_DISTANCE
      })
    }

    if (this.state.currentIndex !== currentIndex) {
      this.setState({ currentIndex }, () => this.props.onChange(this.props.items[currentIndex]))
    }
  }

  onResponderRelease = () => {
    if (this.state.readyToRefresh) {
      this.ListRef.scrollTo({ y: this.state.stickAt })
      this.setState({ refreshing: true })

      setTimeout(() => {
        this.setState({ refreshing: false }, this.props.onRefresh)
      }, 1000)
    }
    return this.setState({ readyToRefresh: false })
  }

  render() {
    const { horizontal, items, ListFooterComponent, renderItem, children, onRefresh } = this.props
    const { currentIndex, readyToRefresh, refreshing, pullUpDistance } = this.state

    return (
      <View>
        {children && children(currentIndex)}
        {onRefresh && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'black',
              height: Math.abs(MIN_PULLUP_DISTANCE),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              {readyToRefresh ? refreshing ? <ActivityIndicator  /> : <Text>Release to go</Text> : <Text>Next page</Text>}
            </View>
        )}
        <FlatList
          horizontal={horizontal}
          pagingEnabled
          indicatorStyle="white"
          data={items}
          getItemLayout={this.getItemLayout}
          keyExtractor={({ id }) => id}
          onScroll={this.onScroll}
          onResponderRelease={onRefresh && this.onResponderRelease}
          extraData={[currentIndex, this.props.extraData]}
          ref={this.captureRef}
          renderItem={({ item, index }) =>
            renderItem(item, {
              index,
              currentIndex,
              shouldRender: between(index, currentIndex - 2, currentIndex + 2),
              isVisible: index === currentIndex,
            })}
        />
      </View>
    )
  }
}