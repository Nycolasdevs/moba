import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MovieCard from './MovieCard';
import RowDragBar from './RowDragBar';
import { getGridCardWidth } from '../utils/layout';
import { COLORS, FONTS, SPACING } from '../theme';

const ROW_CARD_WIDTH = getGridCardWidth();
const CARD_GAP = SPACING.sm;
const VISIBLE_ITEMS = 3;

export default function MovieRow({ title, movies, onPress }) {
  const listRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [listWidth, setListWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const showDragBar = movies.length > VISIBLE_ITEMS;

  const handleScrollTo = useCallback((offset) => {
    listRef.current?.scrollToOffset({ offset, animated: false });
    setScrollX(offset);
  }, []);

  const handleScroll = useCallback((event) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  }, []);

  if (!movies || movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View
        style={styles.listWrap}
        onLayout={(event) => setListWidth(event.nativeEvent.layout.width)}
      >
        <FlatList
          ref={listRef}
          data={movies}
          horizontal
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width) => setContentWidth(width)}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={onPress}
              width={ROW_CARD_WIDTH}
              style={styles.card}
            />
          )}
        />
      </View>

      {showDragBar && (
        <RowDragBar
          scrollX={scrollX}
          listWidth={listWidth}
          contentWidth={contentWidth}
          onScrollTo={handleScrollTo}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  listWrap: {
    width: '100%',
  },
  list: {
    flexGrow: 0,
    ...(Platform.OS === 'web'
      ? {
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }
      : {}),
  },
  listContent: {
    paddingHorizontal: SPACING.md,
  },
  separator: {
    width: CARD_GAP,
  },
  card: {
    marginRight: 0,
  },
});
