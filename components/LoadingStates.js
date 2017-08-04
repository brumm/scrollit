import React from 'react'
import Card from 'scrollit/components/Card'
import glamorous from 'glamorous-native'

const Text = glamorous.text({
  fontSize: 25,
  color: '#fafafa',
})

export const Loading = ({ children }) =>
  <Card>
    <Text>Loading</Text>
    {children}
  </Card>

export const Error = ({ reason }) =>
<Card>
  <Text>
    {':('}
  </Text>
  <Log reason={reason} />
</Card>
