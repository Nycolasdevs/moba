import { CommonActions } from '@react-navigation/native';

export function navigateToWelcome(navigation) {
  let root = navigation;
  while (root.getParent()) {
    root = root.getParent();
  }
  root.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    })
  );
}
