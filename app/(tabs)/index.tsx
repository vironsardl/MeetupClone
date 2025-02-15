import { Stack } from 'expo-router';
import {View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
    </>
  );
}

