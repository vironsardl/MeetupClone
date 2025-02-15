import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  Button,
  Pressable,
  Text,
} from 'react-native';

import { supabase } from '~/utils/supabase';

//  TODO: Adding the authentication flow 

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View className="flex-1 gap-3 bg-white p-5 pt-10">
      <Stack.Screen options={{ title: 'Sign in' }} />

      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => signInWithEmail()}
          disabled={loading}
          className="flex-1 items-center rounded-md border-2 border-red-500 p-3 px-8">
          <Text className="text-lg font-bold text-red-500">Sign In</Text>
        </Pressable>

        <Pressable
          onPress={() => signUpWithEmail()}
          disabled={loading}
          className="flex-1 items-center rounded-md bg-red-500 p-3 px-8">
          <Text className="text-lg font-bold text-white">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
