import React from 'react'
import { AppRegistry, StatusBar, Animated } from 'react-native'
import SideMenu from 'react-native-side-menu'
import { Router, Route, Switch, Redirect } from 'react-router-native'
import glamorous from 'glamorous-native'

import history from 'scrollit/history'
import { subredditFetch } from 'scrollit/api'
import Storage from 'scrollit/packages/react-native-key-value-store'

import Listing from 'scrollit/components/Listing'
import Fetch from 'scrollit/components/Fetch'
import Menu from 'scrollit/components/Menu'
import { Loading, Error } from 'scrollit/components/LoadingStates'
import { Text } from 'scrollit/components/Layout'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

const DEFAULT_SUBREDDIT = 'popular'
const DEFAULT_LIMIT = 100

const AppContainer = glamorous.view({
  backgroundColor: '#1c1c1c',
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
})

const sideMenuOptions = {
  openMenuOffset: ITEM_WIDTH * 0.8,
  autoClosing: false,
  bounceBackOnOverdraw: false,
  animationFunction: (prop, value) =>
    Animated.spring(prop, {
      toValue: value,
      bounciness: 0,
    }),
}

export default class App extends React.Component {
  state = {
    savedSubs: [],
  }

  async componentDidMount() {
    const savedSubs = await Storage.get('savedSubs', [])
    this.setState({ savedSubs })
  }

  captureSideMenuRef = instance => {
    this.sideMenuInstance = instance
  }

  setSavedSubs = async savedSubs => {
    await Storage.set('savedSubs', savedSubs)
    this.setState({ savedSubs })
  }

  closeMenu = () => {
    if (this.sideMenuInstance) {
      this.sideMenuInstance.openMenu(false)
    }
  }

  render() {
    const { savedSubs, isMenuOpen } = this.state

    return (
      <AppContainer>
        <StatusBar hidden />
        <Router history={history}>
          <Switch>
            <Route
              path="/u/:author"
              render={({ match, location }) => (
                <SideMenu
                  ref={this.captureSideMenuRef}
                  {...sideMenuOptions}
                  menu={<Menu savedSubs={savedSubs} setSavedSubs={this.setSavedSubs} />}
                >
                  <Fetch
                    url={`https://www.reddit.com/user/${match.params.author}/submitted.json`}
                    didNavigate={this.closeMenu}
                    func={subredditFetch}
                    component={Listing}
                    loading={
                      <Loading>
                        <Text>{`/u/${match.params.author}`}</Text>
                      </Loading>
                    }
                    error={reason => <Error reason={reason} />}
                  />
                </SideMenu>
              )}
            />

            <Route
              path="/r/:name/:after?"
              render={({ match, location }) => (
                <SideMenu
                  ref={this.captureSideMenuRef}
                  {...sideMenuOptions}
                  menu={
                    <Menu
                      currentSub={match.params.name}
                      savedSubs={savedSubs}
                      setSavedSubs={this.setSavedSubs}
                    />
                  }
                >
                  <Fetch
                    url={`https://www.reddit.com/r/${match.params
                      .name}.json?limit=${DEFAULT_LIMIT}&after=${match.params.after || ''}`}
                    didNavigate={this.closeMenu}
                    subreddit={match.params.name}
                    func={subredditFetch}
                    component={Listing}
                    loading={
                      <Loading>
                        {match.params.name.split('+').map(name => <Text key={name}>{name}</Text>)}
                      </Loading>
                    }
                    error={reason => <Error reason={reason} />}
                  />
                </SideMenu>
              )}
            />

            <Redirect from="/" to={`/r/${DEFAULT_SUBREDDIT}`} />
          </Switch>
        </Router>
      </AppContainer>
    )
  }
}

AppRegistry.registerComponent('scrollit', () => App)
