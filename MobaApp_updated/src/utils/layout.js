import { Dimensions } from 'react-native';
import { SPACING, CARD } from '../theme';

const GRID_COLUMNS = 3;
const GRID_GAP = SPACING.sm;

export function getGridCardWidth(
  columns = GRID_COLUMNS,
  gap = GRID_GAP,
  horizontalPadding = SPACING.md,
) {
  const screenWidth = Dimensions.get('window').width;
  const available = screenWidth - horizontalPadding * 2 - gap * (columns - 1);
  return Math.floor(available / columns);
}

export function getGridCardHeight(width) {
  return Math.round(width * (CARD.height / CARD.width));
}
