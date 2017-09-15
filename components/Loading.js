import React from 'react'
import { Animated, Text } from 'react-native'
import Gradient from 'gradient-color'
import tinycolor from 'tinycolor2'

import Card from 'scrollit/components/Card'

const Bubble = ({ index, animation, color, children }) => {
  const c = tinycolor(color)
  const l = c.getLuminance()
  const light = tinycolor.mix(c, tinycolor('black'), 80)
  const dark = tinycolor.mix(c, tinycolor('white'), 80)
  const textColor = c.getLuminance() > 0.5 ? light : dark

  return (
    <Animated.View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [4, 10],
        }),
        borderRadius: 50,
        backgroundColor: color,
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.5],
            }),
          },
        ],
      }}
    >
      <Text style={{ color: textColor }}>{children}</Text>
    </Animated.View>
  )
}

export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animation: Array.from({ length: props.subreddits.length }, () => new Animated.Value(0)),
    }
  }

  componentDidMount() {
    Animated.stagger(
      100,
      this.state.animation.map(animation =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 1,
              duration: 300,
            }),
            Animated.timing(animation, {
              toValue: 0,
              duration: 300,
            }),
            Animated.delay(300 * this.props.subreddits.length),
          ])
        )
      )
    ).start()
  }

  render() {
    const { subreddits } = this.props
    const { animation } = this.state
    const grad = Gradient(['#9B51E0', '#9DC8F3'], subreddits.length + 2)

    return (
      <Card>
        {subreddits.map((subreddit, i) => (
          <Bubble index={i} key={grad[i]} color={grad[i]} animation={animation[i]}>
            {subreddit}
          </Bubble>
        ))}
      </Card>
    )
  }
}
