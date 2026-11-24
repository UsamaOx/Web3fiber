import { describe, it, expect } from 'vitest';
import {
  emptyLayout,
  addBlock,
  removeBlock,
  updateBlock,
  moveBlock,
  normalizeLayout,
  sanitizeBlockProps,
} from '../src/core/layout.js';

describe('layout helpers', () => {
  it('adds, updates, moves and removes blocks', () => {
    const a = { id: 'a', type: 'text', props: { text: 'A' } };
    const b = { id: 'b', type: 'button', props: {} };
    let layout = addBlock(emptyLayout('home'), a);
    layout = addBlock(layout, b);
    layout = updateBlock(layout, 'a', { text: 'Updated' });
    expect(layout.blocks[0].props.text).toBe('Updated');
    layout = moveBlock(layout, 0, 1);
    expect(layout.blocks[0].id).toBe('b');
    layout = removeBlock(layout, 'b');
    expect(layout.blocks.map((x) => x.id)).toEqual(['a']);
  });

  it('drops malformed records and duplicate IDs from stored layouts', () => {
    const layout = normalizeLayout({ version: 1, blocks: [
      { id: 'one', type: 'text', props: { text: 'hello' } },
      { id: 'one', type: 'button', props: {} },
      { id: 'bad', type: 'text', props: [] },
      null,
    ] }, 'home');
    expect(layout.blocks).toHaveLength(1);
    expect(layout.blocks[0].id).toBe('one');
  });

  it('does not interpret unknown layout versions as the current schema', () => {
    expect(normalizeLayout({ version: 99, blocks: [{ id: 'x', type: 'text', props: {} }] }, 'home'))
      .toEqual({ ...emptyLayout('home'), readOnly: true });
  });

  it('keeps only safe hex colors for editable zone backgrounds', () => {
    const layout = normalizeLayout({
      version: 1,
      backgroundColor: '#AABBCC',
      blocks: [],
    }, 'home');
    const unsafe = normalizeLayout({
      version: 1,
      backgroundColor: 'url(javascript:alert(1))',
      blocks: [],
    }, 'unsafe');

    expect(layout.backgroundColor).toBe('#aabbcc');
    expect(unsafe.backgroundColor).toBeNull();
  });

  it('sanitizes saved props using the registered schema and defaults', () => {
    const definition = {
      defaultProps: { text: 'default', size: 18, align: 'left' },
      schema: {
        text: { type: 'textarea' },
        size: { type: 'range', min: 10, max: 40 },
        align: { type: 'select', options: ['left', 'center', 'right'] },
      },
    };
    expect(sanitizeBlockProps({ text: '<script>not executed</script>', size: 999, align: 'invalid', extra: 'ignored' }, definition))
      .toEqual({ text: '<script>not executed</script>', size: 40, align: 'left' });
  });
});
