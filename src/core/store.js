import { create } from 'zustand';
import { emptyLayout, addBlock, removeBlock, updateBlock, moveBlock } from './layout.js';

export const useEditorStore = create((set, get) => ({
  layouts: {},
  zoneIds: [],
  editMode: false,
  selectedBlockId: null,
  selectedBlockZoneId: null,
  history: {},
  future: {},
  registerZone(zoneId) {
    set((state) => state.zoneIds.includes(zoneId) ? state : { zoneIds: [...state.zoneIds, zoneId] });
  },
  unregisterZone(zoneId) {
    set((state) => ({ zoneIds: state.zoneIds.filter((id) => id !== zoneId) }));
  },
  setLayout(zoneId, layout) {
    set((state) => ({ layouts: { ...state.layouts, [zoneId]: layout } }));
  },
  toggleEdit() { set((s) => ({ editMode: !s.editMode, selectedBlockId: null, selectedBlockZoneId: null })); },
  setEditMode(editMode) { set({ editMode }); },
  selectBlock(selectedBlockId, selectedBlockZoneId = null) {
    set({ selectedBlockId, selectedBlockZoneId });
  },
  commit(zoneId, nextLayout) {
    const state = get();
    const current = state.layouts[zoneId] || emptyLayout(zoneId);
    set({
      layouts: { ...state.layouts, [zoneId]: nextLayout },
      history: { ...state.history, [zoneId]: [...(state.history[zoneId] || []), current].slice(-30) },
      future: { ...state.future, [zoneId]: [] },
    });
  },
  add(zoneId, block) {
    const current = get().layouts[zoneId] || emptyLayout(zoneId);
    get().commit(zoneId, addBlock(current, block));
    get().selectBlock(block.id, zoneId);
  },
  remove(zoneId, id) {
    const current = get().layouts[zoneId] || emptyLayout(zoneId);
    get().commit(zoneId, removeBlock(current, id));
    get().selectBlock(null, zoneId);
  },
  update(zoneId, id, patch) {
    const current = get().layouts[zoneId] || emptyLayout(zoneId);
    get().commit(zoneId, updateBlock(current, id, patch));
  },
  setZoneBackground(zoneId, backgroundColor) {
    if (
      backgroundColor !== null &&
      (typeof backgroundColor !== "string" ||
        !/^#[0-9a-f]{6}$/i.test(backgroundColor))
    ) {
      console.warn("[Web3Fiber] Invalid zone background color was ignored.");
      return;
    }
    const current = get().layouts[zoneId] || emptyLayout(zoneId);
    if (current.readOnly) return;
    get().commit(zoneId, {
      ...current,
      backgroundColor: backgroundColor?.toLowerCase() || null,
    });
  },
  move(zoneId, from, to) {
    const current = get().layouts[zoneId] || emptyLayout(zoneId);
    get().commit(zoneId, moveBlock(current, from, to));
  },
  undo(zoneId) {
    const state = get();
    const stack = state.history[zoneId] || [];
    if (!stack.length) return;
    const current = state.layouts[zoneId] || emptyLayout(zoneId);
    const previous = stack[stack.length - 1];
    set({
      layouts: { ...state.layouts, [zoneId]: previous },
      history: { ...state.history, [zoneId]: stack.slice(0, -1) },
      future: { ...state.future, [zoneId]: [current, ...(state.future[zoneId] || [])] },
    });
  },
  redo(zoneId) {
    const state = get();
    const stack = state.future[zoneId] || [];
    if (!stack.length) return;
    const current = state.layouts[zoneId] || emptyLayout(zoneId);
    const next = stack[0];
    set({
      layouts: { ...state.layouts, [zoneId]: next },
      history: { ...state.history, [zoneId]: [...(state.history[zoneId] || []), current] },
      future: { ...state.future, [zoneId]: stack.slice(1) },
    });
  },
}));
