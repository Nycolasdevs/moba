import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  Flame, Swords, Drama, Rocket, Laugh, LayoutGrid, Film,
} from 'lucide-react-native';
import MovieCard from './MovieCard';
import RowDragBar from './RowDragBar';
import { Icon } from './ui/icon';
import { useResponsive } from '../hooks/useResponsive';
import { COLORS, FONTS, SPACING } from '../theme';

const VISIBLE_ITEMS = 3;

const ROW_ICONS = {
  Flame,
  Swords,
  Drama,
  Rocket,
  Laugh,
  LayoutGrid,
  Film,
};

export default function MovieRow({ title, icon, movies, onPress }) {
  const listRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [listWidth, setListWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const { gridCardWidth, gridGap } = useResponsive();
  const RowIcon = ROW_ICONS[icon] || Film;

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
      <View style={styles.titleRow}>
        <Icon as={RowIcon} size={18} color={COLORS.red} strokeWidth={2.5} />
        <Text style={styles.title}>{title}</Text>
      </View>

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
          ItemSeparatorComponent={() => <View style={{ width: gridGap }} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width) => setContentWidth(width)}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={onPress}
              width={gridCardWidth}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
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
  card: {
    marginRight: 0,
  },
});
