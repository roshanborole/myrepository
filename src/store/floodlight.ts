
type Listener = (isOn: boolean) => void;
let isOn = true;
const listeners = new Set<Listener>();

export const floodlightStore = {
  get: () => isOn,
  toggle: () => {
    isOn = !isOn;
    listeners.forEach(l => l(isOn));
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};
