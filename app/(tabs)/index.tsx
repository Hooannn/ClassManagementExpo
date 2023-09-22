import { StyleSheet, Text, View } from "react-native";
import { Button } from "native-base";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMovies } from "../../services";
export default function TabOneScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const handleSheetChanges = useCallback((index: number) => {
    setBottomSheetIndex(index);
  }, []);

  const { movies, page, goNextPage, goPrevPage, changeMovieType } = useMovies({
    defaultMovieType: "now_playing",
  });
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
