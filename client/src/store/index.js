import { proxy, snapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'

const initialState = {
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',  materialType: 'standard',
  isDarkMode: true,
  zoom: 1,
  // New State
  history: {
    stack: [],
    pointer: -1,
  },  presets: JSON.parse(localStorage.getItem('fabricos_presets')) || []
};

const state = proxy(initialState);

// --- History Undo/Redo Logic ---
const HISTORY_KEYS_TO_TRACK = ['color', 'logoDecal', 'fullDecal', 'isLogoTexture', 'isFullTexture', 'materialType'];

subscribeKey(state, HISTORY_KEYS_TO_TRACK, () => {
  const currentSnapshot = snapshot(state);
  const { history, ...restOfState } = currentSnapshot; // Exclude history itself from snapshots
  
  // If we have "undone", and now make a new change, clear the "future" history
  if (state.history.pointer < state.history.stack.length - 1) {
    state.history.stack = state.history.stack.slice(0, state.history.pointer + 1);
  }
  
  state.history.stack.push(restOfState);
  state.history.pointer = state.history.stack.length - 1;
});

// Initial state push
state.history.stack.push(snapshot(state));
state.history.pointer = 0;


export const undo = () => {
  if (state.history.pointer > 0) {
    state.history.pointer--;
    const previousState = state.history.stack[state.history.pointer];
    Object.assign(state, previousState);
  }
};

export const redo = () => {
  if (state.history.pointer < state.history.stack.length - 1) {
    state.history.pointer++;
    const nextState = state.history.stack[state.history.pointer];
    Object.assign(state, nextState);
  }
};

// --- Preset Logic ---
export const savePreset = (name) => {
  const { history, ...presetState } = snapshot(state);
  const newPreset = { name, state: presetState };
  state.presets = [...state.presets, newPreset];
  localStorage.setItem('fabricos_presets', JSON.stringify(state.presets));
};

export const loadPreset = (presetState) => {
  Object.assign(state, presetState);
};

export const deletePreset = (name) => {
  state.presets = state.presets.filter(p => p.name !== name);
  localStorage.setItem('fabricos_presets', JSON.stringify(state.presets));
};

export default state;