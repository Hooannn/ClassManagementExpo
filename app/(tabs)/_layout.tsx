import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Button, XStack, Text } from 'tamagui';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(bottomBar) => (
        <XStack
          p="$2"
          backgroundColor={'red'}
          ai={'center'}
          jc={'space-around'}
        >
          {bottomBar.state.routes.map((route) => (
            <Link href={`/${route.name}`}>
              <Button>{route.name}</Button>
            </Link>
          ))}
        </XStack>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="plane" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <TabBarIcon name="fire" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Wallets"
        options={{
          title: 'Wallets',
          tabBarIcon: ({ color }) => <TabBarIcon name="tags" color={color} />,
        }}
      />
    </Tabs>
  );
}
