import React from 'react'
import glamorous from 'glamorous-native'

import { ITEM_WIDTH, ITEM_HEIGHT } from 'scrollit/dimensions'

const Card = glamorous.view({
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#333',
})

export default Card
