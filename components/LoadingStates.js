import React from 'react'
import { ActivityIndicator } from 'react-native'
import Card from 'scrollit/components/Card'
import glamorous from 'glamorous-native'

import { Text } from 'scrollit/components/Layout'

export const Loading = ({ children }) =>
  <Card>
    <ActivityIndicator style={{ marginBottom: 20 }} />
    {children}
  </Card>

export const Error = ({ reason }) =>
  <Card>
    <Text>
      {':('}
    </Text>
    {reason &&
      <Text small style={{ marginTop: 20 }}>
        {JSON.stringify(reason.cause, null, 2)}
      </Text>}
  </Card>
