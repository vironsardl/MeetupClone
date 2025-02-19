import dayjs from 'dayjs';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';

import { supabase } from '~/utils/supabase';

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    setEvent(data);

    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_id', id)
      .single();
    setAttendance(attendanceData);

    setLoading(false);
  };

  const jointEvent = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .insert({ user_id: user.id, event_id: event.id })
      .select()
      .single();

    setAttendance(data);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitle: 'Back', headerTintColor: 'black' }}
      />

      <Image source={{ uri: event.image_uri }} className="aspect-video w-full rounded-2xl" />
      <Text className="text-3xl font-bold" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
      </Text>

      {/* footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-200 p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        {attendance ? (
          <Text className="font-bold text-green-500">You are attending</Text>
        ) : (
          <Pressable className="rounded-lg bg-red-500 p-4 px-8" onPress={() => jointEvent()}>
            <Text className="text-lg font-bold text-white">Join and RSVP</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
