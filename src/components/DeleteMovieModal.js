import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Trash2, X } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

export default function DeleteMovieModal({
  visible,
  title,
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={loading ? undefined : onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.iconWrap}>
            <Icon as={Trash2} size={26} color={COLORS.white} />
          </View>

          <Text style={styles.title}>Excluir filme?</Text>
          <Text style={styles.message}>
            Tem certeza que deseja excluir "{title}"?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Icon as={X} size={16} color={COLORS.white} />
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Icon as={Trash2} size={16} color={COLORS.white} />
                  <Text style={styles.deleteText}>Sim, excluir</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.78)',
    padding: SPACING.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.red,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: FONTS.black,
    marginBottom: SPACING.sm,
  },
  message: {
    color: COLORS.gray,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
    minHeight: 46,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.surface3,
  },
  deleteButton: {
    backgroundColor: COLORS.red,
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },
});
