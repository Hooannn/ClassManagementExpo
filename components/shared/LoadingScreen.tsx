import { View, Modal } from 'react-native'
import { EnsureFlexed, Dialog } from 'tamagui'
//import Lottie from 'lottie-react-native'
import React from 'react'
export default function LoadingScreen() {
    return (
        <Dialog open defaultOpen>
            <View w='full' background='primary.900' alignItems='center' justifyContent='center' flex={1}>
                <Text>Loading...</Text>
            </View>
        </Dialog>
    )
}