import React from 'react'
import { Image, View, ScrollView, TouchableWithoutFeedback as Touch, AlertIOS } from 'react-native'
import { Link, Route } from 'react-router-native'
import glamorous from 'glamorous-native'
import Swipeable from 'react-native-swipeable'

import history from 'scrollit/history'
import HeaderScrollView from 'scrollit/components/HeaderScrollView'
import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

const NavLink = ({ children, to, exact }) => (
  <Route
    path={to}
    exact={exact}
    children={({ match }) => (
      <Link style={{}} component={Touch} to={to}>
        {children(match)}
      </Link>
    )}
  />
)

const LinkText = glamorous.text(
  {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    color: '#fafafa',
    width: '100%',
  },
  ({ active }) => ({
    backgroundColor: active ? '#9477DF' : 'black',
  })
)

const Button = glamorous(LinkText)({
  width: null,
  backgroundColor: 'black',
})

const MenuContainer = glamorous.view({
  height: ITEM_HEIGHT,
  backgroundColor: '#1c1c1c',
})

const Spacer = glamorous.view({
  marginVertical: 20,
})

const selectCustomSubreddit = () =>
  AlertIOS.prompt('Enter subreddit', null, text =>
    history.push(`/r/${text.replace(/\s/g, '+').toLowerCase()}`)
  )

const LeftContent = ({ currentSub }) =>
  currentSub ? (
    <Button
      numberOfLines={1}
      style={{
        backgroundColor: '#317e22',
        textAlign: 'right',
      }}
    >
      Add {`r/${currentSub}`}
    </Button>
  ) : null

const rightContent = (
  <Button numberOfLines={1} style={{ backgroundColor: '#b91818' }}>
    Remove
  </Button>
)

export default class Menu extends React.Component {
  render() {
    const { savedSubs, setSavedSubs, currentSub } = this.props

    return (
      <MenuContainer>
        <HeaderScrollView
          headerMinHeight={120}
          headerComponent={
            <Image
              style={{ width: 100, height: 100 }}
              source={require('scrollit/images/icon.png')}
            />
          }
          contentContainerStyle={{
            minHeight: ITEM_HEIGHT,
            justifyContent: 'flex-end',
            paddingBottom: 50,
          }}
        >
          <Touch onPress={selectCustomSubreddit}>
            <LinkText>Enter subreddit name</LinkText>
          </Touch>

          {currentSub && (
            <Touch
              onPress={() => {
                setSavedSubs([...savedSubs, [currentSub]])
              }}
            >
              {!savedSubs.some(sub => sub.join().includes(currentSub)) ? (
                <LinkText numberOfLines={1} style={{ backgroundColor: '#317e22' }}>
                  Add {`r/${currentSub}`}
                </LinkText>
              ) : (
                <View />
              )}
            </Touch>
          )}

          <Spacer>
            {savedSubs.map((sub, index) => (
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
                  {match => (
                    <LinkText numberOfLines={1} active={match}>{`r/${sub.join('+')}`}</LinkText>
                  )}
                </NavLink>
              </Swipeable>
            ))}
          </Spacer>

          <Touch onPress={() => history.goBack()}>
            <LinkText>Navigate back</LinkText>
          </Touch>
        </HeaderScrollView>
      </MenuContainer>
    )
  }
}
