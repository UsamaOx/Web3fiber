const registry = new Map();

export function registerBlock(definition) {
  if (!definition?.type || !definition.component) throw new Error('A block needs a type and component.');
  registry.set(definition.type, definition);
  return definition;
}
export function getBlock(type) { return registry.get(type); }
export function listBlocks() { return [...registry.values()]; }
