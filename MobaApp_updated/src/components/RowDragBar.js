import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

const TRACK_HEIGHT = 4;
const THUMB_MIN_WIDTH = 48;

export default function RowDragBar({
  scrollX,
  listWidth,
  contentWidth,
  onScrollTo,
}) {
  const dragState = useRef({ active: false, startX: 0, startScroll: 0 });
  const trackWidth = listWidth - SPACING.md * 2;
  const maxScroll = Math.max(0, contentWidth - listWidth);
  const canScroll = Platform.OS === 'web' && maxScroll > 0 && trackWidth > 0;

  const { thumbWidth, thumbOffset } = useMemo(() => {
    if (!canScroll) {
      return { thumbWidth: 0, thumbOffset: 0 };
    }

    const width = Math.max(THUMB_MIN_WIDTH, trackWidth * (listWidth / contentWidth));
    const travel = Math.max(0, trackWidth - width);
    const offset = maxScroll > 0 ? (scrollX / maxScroll) * travel : 0;

    return { thumbWidth: width, thumbOffset: offset };
  }, [canScroll, trackWidth, listWidth, contentWidth, scrollX, maxScroll]);

  const scrollFromThumbOffset = useCallback(
    (offset) => {
      const travel = Math.max(0, trackWidth - thumbWidth);
      const ratio = travel > 0 ? offset / travel : 0;
      onScrollTo(Math.max(0, Math.min(maxScroll, ratio * maxScroll)));
    },
    [trackWidth, thumbWidth, maxScroll, onScrollTo],
  );

  useEffect(() => {
    if (!canScroll) return undefined;

    const onMove = (event) => {
      if (!dragState.current.active) return;

      const travel = Math.max(0, trackWidth - thumbWidth);
      const delta = event.clientX - dragState.current.startX;
      const scrollDelta = travel > 0 ? (delta / travel) * maxScroll : 0;

      onScrollTo(
        Math.max(0, Math.min(maxScroll, dragState.current.startScroll + scrollDelta)),
      );
    };

    const onUp = () => {
      dragState.current.active = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [canScroll, trackWidth, thumbWidth, maxScroll, onScrollTo]);

  const handleThumbMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragState.current = {
      active: true,
      startX: event.clientX,
      startScroll: scrollX,
    };
  };

  const handleTrackMouseDown = (event) => {
    if (event.target !== event.currentTarget) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    scrollFromThumbOffset(clickX - thumbWidth / 2);
  };

  if (!canScroll) return null;

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.track, { width: trackWidth }]}
        onMouseDown={handleTrackMouseDown}
      >
        <View
          style={[
            styles.thumb,
            {
              width: thumbWidth,
              transform: [{ translateX: thumbOffset }],
            },
          ]}
          onMouseDown={handleThumbMouseDown}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface3,
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  thumb: {
    height: TRACK_HEIGHT + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.red,
    cursor: 'grab',
    userSelect: 'none',
    opacity: 0.9,
  },
});
