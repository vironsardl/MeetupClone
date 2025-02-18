import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullname] = useState('');

  const { session } = useAuth();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setFullname(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <View className="flex-1 gap-3 bg-white p-5">
        <Stack.Screen options={{ title: 'Profile' }} />

        <TextInput
          editable={false}
          value={session.user?.email}
          placeholder="Email"
          autoCapitalize="none"
          className="rounded-md border border-gray-200 p-3 text-gray-500"
        />

        <TextInput
          onChangeText={(text) => setFullname(text)}
          value={fullName}
          placeholder="Full Name"
          autoCapitalize="none"
          className="rounded-md border border-gray-200 p-3"
        />

        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
          className="rounded-md border border-gray-200 p-3"
        />

        <TextInput
          onChangeText={(text) => setWebsite(text)}
          value={website}
          placeholder="Website"
          autoCapitalize="none"
          className="rounded-md border border-gray-200 p-3"
        />

        <Pressable
          onPress={() =>
            updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullName })
          }
          disabled={loading}
          className="items-center rounded-md bg-blue-500 p-3 px-8">
          <Text className="text-lg font-bold text-white">Update Profile</Text>
        </Pressable>

        <Button
          title="Sign out"
          onPress={() => {
            supabase.auth.signOut();
          }}
        />
      </View>
    </>
  );
}
