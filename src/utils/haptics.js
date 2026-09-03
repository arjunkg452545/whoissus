export const triggerHaptic = (type = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(25);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'heavy':
          navigator.vibrate([60, 40, 60]);
          break;
        case 'warning':
          navigator.vibrate([100, 50, 100, 50, 150]);
          break;
        case 'success':
          navigator.vibrate([40, 60, 80]);
          break;
        default:
          navigator.vibrate(30);
      }
    } catch (e) {
      // Haptics not allowed or denied
    }
  }
};
