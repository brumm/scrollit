import React from 'react'
import { View, ScrollView, TouchableWithoutFeedback as Touch, AlertIOS } from 'react-native'
import { Link, Route } from 'react-router-native'
import glamorous from 'glamorous-native'
import Swipeable from 'react-native-swipeable'

import history from 'scrollit/history'
import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

const LinkText = glamorous.text({
  fontSize: 20,
  padding: 10,
  marginVertical: 5,
  color: '#fafafa',
  backgroundColor: 'black',
  width: ITEM_WIDTH,
})

const Button = glamorous.text({
  fontSize: 20,
  padding: 10,
  marginVertical: 5,
  color: '#fafafa',
  backgroundColor: 'black',
})

const MenuContainer = glamorous.view({
  height: ITEM_HEIGHT,
  backgroundColor: '#1c1c1c',
})

const selectCustomSubreddit = () =>
  AlertIOS.prompt('Enter subreddit', null, text => history.push(`/r/${text.toLowerCase()}`))

const LeftContent = ({ currentSub }) =>
  currentSub
    ? <Button style={{ backgroundColor: '#317e22' }}>
        Add {`r/${currentSub}`}
      </Button>
    : null

const rightContent = <Button style={{ backgroundColor: '#b91818' }}>Remove</Button>

export default class Menu extends React.Component {
  render() {
    const { savedSubs, setSavedSubs, currentSub } = this.props

    return (
      <MenuContainer>
        <ScrollView contentContainerStyle={{
          minHeight: ITEM_HEIGHT,
          justifyContent: 'flex-end',
          paddingBottom: 50,
        }}>
          <Touch onPress={selectCustomSubreddit}>
            <LinkText>Enter subreddit name</LinkText>
          </Touch>

          {currentSub &&
            <Touch
              onPress={() => {
                setSavedSubs([...savedSubs, [currentSub]])
              }}
              >
                <LinkText style={{ backgroundColor: '#317e22' }}>
                  Add {`r/${currentSub}`}
                </LinkText>
              </Touch>}

              <View style={{ marginVertical: 30 }}>
                {savedSubs.map((sub, index) =>
                  <Swipeable
                    key={`${sub}-${index}`}
                    leftContent={<LeftContent currentSub={currentSub} />}
                    rightContent={rightContent}
                    onLeftActionRelease={() => {
                      currentSub &&
                      setSavedSubs(
                        savedSubs.map(savedsub => {
                          if (savedsub.join() === sub.join()) {
                            return [...savedsub, currentSub]
                          } else {
                            return savedsub
                          }
                        })
                      )
                    }}
                    onRightActionRelease={() => {
                      setSavedSubs(savedSubs.filter(savedsub => savedsub.join() !== sub.join()))
                    }}
                    >
                      <Link to={`/r/${sub.join('+')}`} key={sub} component={Touch}>
                      <LinkText numberOfLines={1}>{`/r/${sub.join('+')}`}</LinkText>
                    </Link>
                  </Swipeable>
                )}
              </View>

              <Touch onPress={() => history.goBack()}>
                <LinkText>Back</LinkText>
              </Touch>
        </ScrollView>
      </MenuContainer>
    )
  }
}
