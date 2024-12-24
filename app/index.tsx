import { Redirect } from 'expo-router'
import React from 'react'

const MainEntryScreen = () => {
  return <Redirect href="/(auth)/onboarding" />
}

export default MainEntryScreen