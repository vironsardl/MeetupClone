import dayjs from 'dayjs';
import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, Image, Pressable } from 'react-native';

import events from '~/assets/events.json';

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitle: 'Back', headerTintColor: 'black' }}
      />

      <Image source={{ uri: event.image }} className="aspect-video w-full rounded-2xl" />
      <Text className="text-3xl font-bold" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.datetime).format('ddd, D MMM')} · {dayjs(event.datetime).format('h:mm A')}
      </Text>

      {/* footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-200 p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        <Pressable className="rounded-lg bg-red-500 p-4 px-8">
          <Text className="text-lg font-bold text-white">Join and RSVP</Text>
        </Pressable>
      </View>
    </View>
  );
}
