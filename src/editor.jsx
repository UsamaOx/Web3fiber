import React from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { listBlocks } from "./core/registry.js";
import { useEditorStore } from "./core/store.js";
import { useEditorContext } from "./runtime/EditorProvider.jsx";
import "./styles.css";

function SortableItem({ block, zoneId }) {
  const selected = useEditorStore((s) => s.selectedBlockId === block.id);
  const select = useEditorStore((s) => s.selectBlock);
  const remove = useEditorStore((s) => s.remove);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const definition = listBlocks().find((item) => item.type === block.type);
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w3f-layer ${selected ? "is-selected" : ""}`}
      onClick={() => select(block.id, zoneId)}
    >
      <button
        className="w3f-drag"
        aria-label={`Reorder ${definition?.label || block.type}`}
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <span>{definition?.label || block.type}</span>
      <button
        className="w3f-delete"
        aria-label="Delete block"
        onClick={(e) => {
          e.stopPropagation();
          remove(zoneId, block.id);
        }}
      >
        ×
      </button>
    </div>
  );
}

function Field({ field, value, onChange }) {
  if (field.type === "select")
    return (
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {(field.options || []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  if (field.type === "color")
    return (
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (field.type === "range")
    return (
      <div className="w3f-range">
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value ?? field.min}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <small>{value}</small>
      </div>
    );
  if (field.type === "textarea")
    return (
      <textarea
        rows="3"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function EditorUI({ zoneId }) {
  const { canEdit } = useEditorContext();
  const editMode = useEditorStore((s) => s.editMode);
  const toggleEdit = useEditorStore((s) => s.toggleEdit);
  const layouts = useEditorStore((s) => s.layouts);
  const zoneIds = useEditorStore((s) => s.zoneIds);
  const history = useEditorStore((s) => s.history);
  const future = useEditorStore((s) => s.future);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const selectedZoneId = useEditorStore((s) => s.selectedBlockZoneId);
  const add = useEditorStore((s) => s.add);
  const update = useEditorStore((s) => s.update);
  const setZoneBackground = useEditorStore((s) => s.setZoneBackground);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const move = useEditorStore((s) => s.move);
  const [chosenZone, setChosenZone] = React.useState(zoneId || "");
  React.useEffect(() => {
    if (zoneId) setChosenZone(zoneId);
    else if (!zoneIds.length && chosenZone) setChosenZone("");
    else if (!chosenZone && zoneIds.length) setChosenZone(zoneIds[0]);
    else if (chosenZone && !zoneIds.includes(chosenZone) && zoneIds.length)
      setChosenZone(zoneIds[0]);
  }, [zoneId, zoneIds, chosenZone]);
  const zones = zoneId ? [zoneId] : zoneIds;
  const selectedZone = zones.includes(selectedZoneId) ? selectedZoneId : "";
  const activeZone = zoneId || selectedZone || chosenZone || zones[0];
  const layout = layouts[activeZone] || { blocks: [] };
  const selected = layout.blocks.find((b) => b.id === selectedId);
  const definition =
    selected && listBlocks().find((b) => b.type === selected.type);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const panelRef = React.useRef(null);
  const panelDrag = React.useRef(null);
  const [panelPosition, setPanelPosition] = React.useState({ x: 0, y: 0 });

  const clampPanelPosition = (x, y, bounds) => ({
    x: Math.max(-bounds.left, Math.min(window.innerWidth - bounds.right, x)),
    y: Math.max(-bounds.top, Math.min(window.innerHeight - bounds.bottom, y)),
  });

  const movePanelBy = (x, y) => {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const bounds = {
      left: rect.left - panelPosition.x,
      right: rect.right - panelPosition.x,
      top: rect.top - panelPosition.y,
      bottom: rect.bottom - panelPosition.y,
    };
    setPanelPosition(
      clampPanelPosition(panelPosition.x + x, panelPosition.y + y, bounds),
    );
  };

  const handlePanelPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    panelDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: panelPosition,
      bounds: {
        left: rect.left - panelPosition.x,
        right: rect.right - panelPosition.x,
        top: rect.top - panelPosition.y,
        bottom: rect.bottom - panelPosition.y,
      },
    };
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  };

  const handlePanelPointerMove = (event) => {
    const drag = panelDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPanelPosition(
      clampPanelPosition(
        drag.position.x + event.clientX - drag.startX,
        drag.position.y + event.clientY - drag.startY,
        drag.bounds,
      ),
    );
  };

  const handlePanelKeyDown = (event) => {
    const step = event.shiftKey ? 30 : 10;
    const movement = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[event.key];
    if (!movement) return;
    event.preventDefault();
    movePanelBy(movement[0], movement[1]);
  };

  const addItem = (definition) => {
    if (!activeZone) return;
    add(activeZone, {
      id: `w3f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: definition.type,
      props: { ...definition.defaultProps },
    });
  };
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = layout.blocks.findIndex((b) => b.id === active.id);
    const to = layout.blocks.findIndex((b) => b.id === over.id);
    if (from >= 0 && to >= 0) move(activeZone, from, to);
  };

  if (!canEdit) return null;

  return (
    <div className="w3f-editor-root">
      <button
        className={`w3f-launch ${editMode ? "active" : ""}`}
        onClick={toggleEdit}
      >
        <span className="w3f-launch-dot" />{" "}
        {editMode ? "Exit editor" : "Edit website"}
      </button>
      {editMode && (
        <div
          ref={panelRef}
          className="w3f-panel"
          style={{
            transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
          }}
        >
          <header
            className="w3f-panel-head"
            aria-label="Move editor"
            tabIndex={0}
            onPointerDown={handlePanelPointerDown}
            onPointerMove={handlePanelPointerMove}
            onPointerUp={() => {
              panelDrag.current = null;
            }}
            onPointerCancel={() => {
              panelDrag.current = null;
            }}
            onKeyDown={handlePanelKeyDown}
          >
            <div>
              <b>Web3Fiber</b>
              <small>VISUAL SITE EDITOR</small>
            </div>
            <button onClick={toggleEdit} aria-label="Close editor">
              ×
            </button>
          </header>
          {zones.length > 1 && !zoneId && (
            <label className="w3f-zone-picker">
              <span>Editing zone</span>
              <select
                value={activeZone || ""}
                onChange={(event) => {
                  setChosenZone(event.target.value);
                  useEditorStore.getState().selectBlock(null);
                }}
                aria-label="Choose editable zone"
              >
                {zones.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="w3f-toolbar">
            <button
              onClick={() => undo(activeZone)}
              disabled={!activeZone || !(history[activeZone] || []).length}
            >
              ↶ Undo
            </button>
            <button
              onClick={() => redo(activeZone)}
              disabled={!activeZone || !(future[activeZone] || []).length}
            >
              ↷ Redo
            </button>
          </div>
          {activeZone && (
            <section className="w3f-panel-section">
              <h3>Zone appearance</h3>
              <label className="w3f-field">
                <span>Background color</span>
                <input
                  type="color"
                  aria-label="Zone background color"
                  value={layout.backgroundColor || "#ffffff"}
                  disabled={layout.readOnly}
                  onChange={(event) =>
                    setZoneBackground(activeZone, event.target.value)
                  }
                />
              </label>
              <button
                type="button"
                className="w3f-zone-background-reset"
                disabled={!layout.backgroundColor || layout.readOnly}
                onClick={() => setZoneBackground(activeZone, null)}
              >
                Clear background
              </button>
            </section>
          )}
          <section className="w3f-panel-section">
            <h3>Block library</h3>
            {layout.readOnly && (
              <p className="w3f-muted">
                This layout was created by a newer version and is read-only.
              </p>
            )}
            <div className="w3f-palette">
              {listBlocks().map((item) => (
                <button
                  key={item.type}
                  type="button"
                  draggable={!layout.readOnly}
                  disabled={layout.readOnly}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "copy";
                    event.dataTransfer.setData(
                      "application/web3fiber-block",
                      item.type,
                    );
                  }}
                  onClick={() => {
                    if (activeZone && !layout.readOnly) {
                      addItem(item);
                    }
                  }}
                >
                  <span>
                    {item.category === "3D"
                      ? "◇"
                      : item.category === "Media"
                        ? "▧"
                        : "＋"}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>
          <section className="w3f-panel-section">
            <h3>
              Layers <small>{layout.blocks.length}</small>
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={layout.blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {layout.blocks.map((block) => (
                  <SortableItem
                    key={block.id}
                    block={block}
                    zoneId={activeZone}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {!activeZone && (
              <p className="w3f-muted">
                Add an EditableZone to your page to start editing.
              </p>
            )}
            {activeZone && !layout.blocks.length && (
              <p className="w3f-muted">Add a block to get started.</p>
            )}
          </section>
          <section className="w3f-panel-section">
            <h3>Inspector</h3>
            {!selected || !definition ? (
              <p className="w3f-muted">
                Select a layer to edit its properties.
              </p>
            ) : (
              Object.entries(definition.schema || {}).map(([key, field]) => (
                <label className="w3f-field" key={key}>
                  <span>{field.label}</span>
                  <Field
                    field={field}
                    value={selected.props[key]}
                    onChange={(value) =>
                      update(activeZone, selected.id, { [key]: value })
                    }
                  />
                </label>
              ))
            )}
          </section>
          <footer className="w3f-panel-foot">
            Changes save automatically using your configured storage adapter.
          </footer>
        </div>
      )}
    </div>
  );
}
