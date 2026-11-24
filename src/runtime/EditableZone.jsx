import { useEffect, useState } from "react";
import { listBlocks } from "../core/registry.js";
import { useEditorStore } from "../core/store.js";
import { emptyLayout, normalizeLayout } from "../core/layout.js";
import { useEditorContext } from "./EditorProvider.jsx";
import BlockRenderer from "./BlockRenderer.jsx";

export function EditableZone({ id, fallback = null, className = "" }) {
  const { storage, canEdit } = useEditorContext();

  const layout = useEditorStore((s) => s.layouts[id]);
  const setLayout = useEditorStore((s) => s.setLayout);
  const registerZone = useEditorStore((s) => s.registerZone);
  const unregisterZone = useEditorStore((s) => s.unregisterZone);

  const editMode = useEditorStore((s) => s.editMode) && canEdit;

  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectedBlockZoneId = useEditorStore((s) => s.selectedBlockZoneId);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  const [loadedZoneId, setLoadedZoneId] = useState(null);
  const loaded = loadedZoneId === id;

  // Allow the zone to receive dragged blocks.
  const handleDragOver = (event) => {
    if (!editMode || layout?.readOnly) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  // Add the dragged block to this specific editable zone.
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.classList.remove("w3f-drop-active");

    if (!editMode || layout?.readOnly) return;

    const blockType = event.dataTransfer.getData("application/web3fiber-block");

    if (!blockType) return;

    const definition = listBlocks().find((item) => item.type === blockType);

    if (!definition) {
      console.warn(
        `[Web3Fiber] Block type "${blockType}" was not found in the registry.`,
      );
      return;
    }

    const newBlock = {
      id: `w3f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: definition.type,
      props: { ...definition.defaultProps },
    };

    // Add the block to the zone where it was dropped.
    useEditorStore.getState().add(id, newBlock);
  };

  // Show a visual indicator when a block enters the zone.
  const handleDragEnter = (event) => {
    if (!editMode || layout?.readOnly) return;

    event.preventDefault();
    event.currentTarget.classList.add("w3f-drop-active");
  };

  // Remove the visual indicator when the dragged block leaves the zone.
  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      event.currentTarget.classList.remove("w3f-drop-active");
    }
  };

  // Register the editable zone and load its saved layout.
  useEffect(() => {
    if (!id || typeof id !== "string") {
      console.error("[Web3Fiber] EditableZone requires a non-empty string id.");
      return undefined;
    }

    registerZone(id);

    let active = true;
    setLoadedZoneId(null);

    Promise.resolve()
      .then(() => storage.load(id))
      .then((saved) => {
        if (!active) return;

        setLayout(id, normalizeLayout(saved || emptyLayout(id), id));
        setLoadedZoneId(id);
      })
      .catch((error) => {
        console.warn("[Web3Fiber] Storage load failed:", error);

        if (active) {
          setLayout(id, emptyLayout(id));
          setLoadedZoneId(id);
        }
      });

    return () => {
      active = false;
      unregisterZone(id);
    };
  }, [id, storage, setLayout, registerZone, unregisterZone]);

  // Automatically save layout changes.
  useEffect(() => {
    if (
      !loaded ||
      !layout ||
      layout.readOnly ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const handle = window.setTimeout(() => {
      Promise.resolve()
        .then(() => storage.save(id, layout))
        .catch((error) => {
          console.warn("[Web3Fiber] Save failed:", error);
        });
    }, 350);

    return () => window.clearTimeout(handle);
  }, [id, layout, loaded, storage]);

  // Display fallback content while the zone is loading.
  if (!loaded) {
    return <div className={className}>{fallback}</div>;
  }

  // Protect layouts created with a newer unsupported format.
  if (layout?.readOnly) {
    return (
      <div className={`w3f-layout-warning ${className}`.trim()} role="status">
        {fallback}

        <p>
          This saved layout uses a newer Web3Fiber format. It has been left
          untouched to prevent data loss.
        </p>
      </div>
    );
  }

  const blocks = layout?.blocks || [];

  // Show fallback content when there are no blocks and editing is disabled.
  if (!blocks.length && !editMode && !layout?.backgroundColor) {
    return <>{fallback}</>;
  }

  return (
    <section
      className={`w3f-zone ${
        editMode ? "w3f-zone-editing" : ""
      } ${className}`.trim()}
      style={{ backgroundColor: layout?.backgroundColor || undefined }}
      data-web3fiber-zone={id}
      aria-label={`Editable area ${id}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          selectBlock(null, id);
        }
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`w3f-zone-block ${
            editMode ? "w3f-selectable" : ""
          } ${
            selectedBlockId === block.id && selectedBlockZoneId === id
              ? "is-selected"
              : ""
          }`}
          onClick={
            editMode
              ? (event) => {
                  event.stopPropagation();
                  selectBlock(block.id, id);
                }
              : undefined
          }
        >
          <BlockRenderer block={block} zoneId={id} />
        </div>
      ))}

      {!blocks.length && !editMode && fallback}

      {editMode && blocks.length === 0 && (
        <div className="w3f-empty-zone">
          Add a block from the editor library.
        </div>
      )}
    </section>
  );
}
