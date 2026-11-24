import { createContext, useContext, useMemo, useEffect } from 'react';
import { useEditorStore } from '../core/store.js';
import { localStorageAdapter } from '../core/storage.js';

const EditorContext = createContext(null);
const defaultStorage = localStorageAdapter();

export function EditorProvider({ children, storage, canEdit = false }) {
  const adapter = useMemo(() => storage || defaultStorage, [storage]);
  const setEditMode = useEditorStore((s) => s.setEditMode);

  useEffect(() => {
    if (!canEdit) setEditMode(false);
  }, [canEdit, setEditMode]);

  const value = useMemo(() => ({ storage: adapter, canEdit: Boolean(canEdit) }), [adapter, canEdit]);
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
  const value = useContext(EditorContext);
  if (!value) throw new Error('Web3Fiber components must be inside EditorProvider.');
  return value;
}
