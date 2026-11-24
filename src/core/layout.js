export const LAYOUT_VERSION = 1;

export function emptyLayout(zoneId) {
  return { version: LAYOUT_VERSION, zoneId, backgroundColor: null, blocks: [] };
}

/** Validate the persisted envelope and discard malformed block records. */
export function normalizeLayout(layout, zoneId) {
  if (!layout || typeof layout !== 'object' || !Array.isArray(layout.blocks)) {
    return emptyLayout(zoneId);
  }

  // Version 1 is the only format currently supported. Unknown future versions
  // are not interpreted as v1 because doing so could corrupt saved layouts.
  if (layout.version != null && layout.version !== LAYOUT_VERSION) {
    console.warn(`[Web3Fiber] Unsupported layout version "${layout.version}" for zone "${zoneId}". The zone will remain read-only to protect its saved data.`);
    return { ...emptyLayout(zoneId), readOnly: true };
  }

  const seenIds = new Set();
  const blocks = layout.blocks.filter((block) => {
    if (!block || typeof block !== 'object' || Array.isArray(block)) return false;
    if (typeof block.id !== 'string' || !block.id.trim() || seenIds.has(block.id)) return false;
    if (typeof block.type !== 'string' || !block.type.trim()) return false;
    if (!block.props || typeof block.props !== 'object' || Array.isArray(block.props)) return false;
    seenIds.add(block.id);
    return true;
  }).map((block) => ({
    id: block.id,
    type: block.type,
    props: { ...block.props },
  }));

  const backgroundColor =
    typeof layout.backgroundColor === "string" &&
    /^#[0-9a-f]{6}$/i.test(layout.backgroundColor)
      ? layout.backgroundColor.toLowerCase()
      : null;

  return { version: LAYOUT_VERSION, zoneId, backgroundColor, blocks };
}

export function addBlock(layout, block, index = layout.blocks.length) {
  const blocks = [...layout.blocks];
  blocks.splice(Math.max(0, Math.min(index, blocks.length)), 0, block);
  return { ...layout, blocks };
}

export function removeBlock(layout, blockId) {
  return { ...layout, blocks: layout.blocks.filter((b) => b.id !== blockId) };
}

export function updateBlock(layout, blockId, patch) {
  return {
    ...layout,
    blocks: layout.blocks.map((b) =>
      b.id === blockId ? { ...b, props: { ...b.props, ...patch } } : b
    ),
  };
}

export function moveBlock(layout, fromIndex, toIndex) {
  const blocks = [...layout.blocks];
  if (fromIndex < 0 || fromIndex >= blocks.length || toIndex < 0 || toIndex >= blocks.length) return layout;
  const [item] = blocks.splice(fromIndex, 1);
  blocks.splice(toIndex, 0, item);
  return { ...layout, blocks };
}

/** Keep only values described by the registered block schema. */
export function sanitizeBlockProps(props, definition) {
  const schema = definition?.schema || {};
  const defaults = definition?.defaultProps || {};
  const safe = { ...defaults };

  for (const [key, field] of Object.entries(schema)) {
    if (!Object.prototype.hasOwnProperty.call(props || {}, key)) continue;
    const value = props[key];
    if (value == null) continue;

    if (field.type === 'range') {
      const number = Number(value);
      if (Number.isFinite(number)) safe[key] = Math.min(field.max, Math.max(field.min, number));
    } else if (field.type === 'url') {
      if (typeof value === 'string' && isSafeUrl(value)) safe[key] = value.slice(0, 2048);
    } else if (field.type === 'color' || field.type === 'text' || field.type === 'textarea') {
      if (typeof value === 'string') safe[key] = value.slice(0, 10000);
    } else if (field.type === 'select') {
      if (typeof value === 'string' && field.options?.includes(value)) safe[key] = value;
    } else if (field.type === 'boolean') {
      if (typeof value === 'boolean') safe[key] = value;
    }
  }

  return safe;
}

function isSafeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return true;
  if (/^(#|\/|\.\.?\/)/.test(trimmed)) return true;
  return false;
}
