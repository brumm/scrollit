import React from 'react'
import { View, ScrollView, TouchableWithoutFeedback as Touch, AlertIOS } from 'react-native'
import { Link, Route } from 'react-router-native'
import glamorous from 'glamorous-native'
import Swipeable from 'react-native-swipeable'

import history from 'scrollit/history'
import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

const NavLink = ({ children, to, exact }) =>
  <Route
    path={to}
    exact={exact}
    children={({ match }) =>
      <Link style={{}} component={Touch} to={to}>
        {children(match)}
      </Link>}
  />

const LinkText = glamorous.text({
  fontSize: 20,
  paddingVertical: 10,
  paddingHorizontal: 20,
  marginVertical: 5,
  color: '#fafafa',
  width: ITEM_WIDTH,
}, ({ active }) => ({
  backgroundColor: active ? '#295380' : 'black',
}))

const Button = glamorous.text({
  fontSize: 20,
  paddingVertical: 10,
  paddingHorizontal: 20,
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
    ? <Button
        style={{
          backgroundColor: '#317e22',
          textAlign: 'right',
        }}
      >
        Add {`r/${currentSub}`}
      </Button>
    : null

const rightContent = <Button style={{ backgroundColor: '#b91818' }}>Remove</Button>

export default class Menu extends React.Component {
  render() {
    const { savedSubs, setSavedSubs, currentSub } = this.props

    return (
      <MenuContainer>
        <ScrollView
          contentContainerStyle={{
            minHeight: ITEM_HEIGHT,
            justifyContent: 'flex-end',
            paddingBottom: 50,
          }}
        >
          <Touch onPress={selectCustomSubreddit}>
            <LinkText>Enter subreddit name</LinkText>
          </Touch>

          {currentSub &&
            <Touch
              onPress={() => {
                setSavedSubs([...savedSubs, [currentSub]])
              }}
            >
              {!savedSubs.some(sub => sub.join().includes(currentSub))
                ? <LinkText style={{ backgroundColor: '#317e22' }}>
                    Add {`r/${currentSub}`}
                  </LinkText>
                : <View />}
            </Touch>}

          <View style={{ marginVertical: 30 }}>
            {savedSubs.map((sub, index) =>
              <Swipeable
                key={`${sub}-${index}`}
                leftContent={!sub.includes(currentSub) && <LeftContent currentSub={currentSub} />}
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
                <NavLink to={`/r/${sub.join('+')}`} key={sub} component={Touch}>
                  {match => <LinkText active={match}>{`r/${sub.join('+')}`}</LinkText>}
                </NavLink>
              </Swipeable>
            )}
          </View>

          <Touch onPress={() => history.goBack()}>
            <LinkText>Navigate back</LinkText>
          </Touch>
        </ScrollView>
      </MenuContainer>
    )
  }
}
