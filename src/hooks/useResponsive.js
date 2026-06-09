import { useWindowDimensions } from 'react-native';
import { SPACING, CARD } from '../theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isCompact = width < 380;
  const isMedium = width >= 380 && width < 768;
  const isWide = width >= 768;

  const horizontalPadding = isCompact ? SPACING.sm : SPACING.md;
  const gridGap = SPACING.sm;
  const gridColumns = width < 340 ? 2 : width < 560 ? 3 : width < 900 ? 4 : 5;

  const contentWidth = width;
  const availableGridWidth = contentWidth - horizontalPadding * 2 - gridGap * (gridColumns - 1);
  const gridCardWidth = Math.floor(availableGridWidth / gridColumns);
  const gridCardHeight = Math.round(gridCardWidth * (CARD.height / CARD.width));

  const heroHeight = Math.min(height * (isCompact ? 0.5 : 0.58), isWide ? 480 : isCompact ? 260 : 400);
  const heroPosterWidth = Math.min(contentWidth * (isCompact ? 0.78 : 0.72), isWide ? 360 : 300);
  const heroPosterHeight = heroPosterWidth * 1.5;
  const thumbWidth = isCompact ? 64 : isWide ? 88 : 72;

  return {
    width,
    height,
    contentWidth,
    isCompact,
    isMedium,
    isWide,
    horizontalPadding,
    gridGap,
    gridColumns,
    gridCardWidth,
    gridCardHeight,
    heroHeight,
    heroPosterWidth,
    heroPosterHeight,
    thumbWidth,
    thumbHeight: thumbWidth * 1.5,
    thumbGap: isCompact ? 8 : 10,
    titleSize: isCompact ? 28 : isWide ? 42 : 34,
    screenTitleSize: isCompact ? 22 : 26,
    formPadding: isCompact ? SPACING.md : SPACING.lg,
  };
}
