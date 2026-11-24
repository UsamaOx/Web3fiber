// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EditorProvider } from '../src/runtime/EditorProvider.jsx';
import { EditableZone } from '../src/runtime/EditableZone.jsx';
import '../src/blocks/index.js';
import { EditorUI } from '../src/editor.jsx';
import { ButtonBlock, TextBlock } from '../src/blocks/basic.jsx';
import { memoryStorageAdapter } from '../src/core/storage.js';
import { listBlocks } from '../src/core/registry.js';
import { sanitizeBlockProps } from '../src/core/layout.js';
import { useEditorStore } from '../src/core/store.js';

afterEach(() => {
  cleanup();
  useEditorStore.getState().setEditMode(false);
});

describe('editor runtime', () => {
  it('loads an editable zone and displays its fallback when no layout exists', async () => {
    const storage = memoryStorageAdapter();
    render(
      <EditorProvider storage={storage} canEdit>
        <EditableZone id="runtime-test-zone" fallback={<h1>Original content</h1>} />
      </EditorProvider>,
    );

    expect(await screen.findByText('Original content')).toBeTruthy();
    await waitFor(() => expect(useEditorStore.getState().layouts['runtime-test-zone']).toBeTruthy());
  });

  it('does not expose the editor launcher when canEdit is false', () => {
    render(
      <EditorProvider storage={memoryStorageAdapter()} canEdit={false}>
        <EditableZone id="permission-test-zone" fallback={<p>Public content</p>} />
        <EditorUI />
      </EditorProvider>,
    );

    expect(screen.queryByRole('button', { name: /edit website/i })).toBeNull();
  });

  it('opens the editor when the host application grants edit permission', async () => {
    render(
      <EditorProvider storage={memoryStorageAdapter()} canEdit>
        <EditableZone id="open-editor-test-zone" fallback={<p>Public content</p>} />
        <EditorUI />
      </EditorProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /edit website/i }));
    expect(await screen.findByText('Block library')).toBeTruthy();
  });

  it('registers new content blocks and exposes fonts and animations', () => {
    const blocks = listBlocks();
    const blockTypes = blocks.map((block) => block.type);
    expect(blockTypes).toContain('interactive-cube-field');
    expect(blockTypes).toContain('feature-grid');
    expect(blockTypes).toContain('callout');
    expect(blockTypes).toContain('quote');

    const cubeField = blocks.find((block) => block.type === 'interactive-cube-field');
    expect(cubeField.defaultProps.count).toBe(144);
    expect(cubeField.schema.background.type).toBe('color');
    expect(sanitizeBlockProps({ count: 9 }, cubeField).count).toBe(96);

    const textBlock = blocks.find((block) => block.type === 'text');
    expect(textBlock.schema.fontFamily.options).toContain('Georgia');
    expect(textBlock.schema.fontFamily.options).toContain('Poppins');
    expect(textBlock.schema.hoverEffect.options).toContain('bounce');
    expect(textBlock.schema.hoverIntensity.type).toBe('range');
    expect(textBlock.schema.hoverDuration.type).toBe('range');
    const buttonBlock = blocks.find((block) => block.type === 'button');
    expect(buttonBlock.schema.fontFamily.options).toContain('Poppins');
    expect(buttonBlock.schema.hoverBackground.type).toBe('color');
    for (const block of blocks) {
      expect(block.schema.animation.options).toContain('slideLeft');
      expect(block.schema.animation.options).toContain('float');
    }
  });

  it('applies Poppins to text and button elements', () => {
    render(
      <>
        <TextBlock text="Poppins text" fontFamily="Poppins" />
        <ButtonBlock label="Poppins button" fontFamily="Poppins" />
      </>,
    );

    expect(screen.getByText('Poppins text').style.fontFamily).toBe('Poppins');
    expect(
      screen.getByRole('link', { name: 'Poppins button' }).style.fontFamily,
    ).toBe('Poppins');
  });

  it('sets and clears a saved background color for an editable zone', async () => {
    render(
      <EditorProvider storage={memoryStorageAdapter()} canEdit>
        <EditableZone id="background-test-zone" />
        <EditorUI />
      </EditorProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /edit website/i }));
    await waitFor(() =>
      expect(useEditorStore.getState().layouts['background-test-zone']).toBeTruthy(),
    );

    const colorControl = screen.getByLabelText('Zone background color');
    fireEvent.change(colorControl, { target: { value: '#aabbcc' } });
    expect(
      useEditorStore.getState().layouts['background-test-zone'].backgroundColor,
    ).toBe('#aabbcc');
    expect(
      document.querySelector('[data-web3fiber-zone="background-test-zone"]').style
        .backgroundColor,
    ).not.toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Clear background' }));
    expect(
      useEditorStore.getState().layouts['background-test-zone'].backgroundColor,
    ).toBeNull();
  });

  it('moves the editor panel by dragging its header', async () => {
    render(
      <EditorProvider storage={memoryStorageAdapter()} canEdit>
        <EditorUI />
      </EditorProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /edit website/i }));
    const header = screen.getByRole('banner', { name: 'Move editor' });
    fireEvent.pointerDown(header, {
      button: 0,
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(header, {
      pointerId: 1,
      clientX: 160,
      clientY: 140,
    });
    fireEvent.pointerUp(header, { pointerId: 1 });

    expect(document.querySelector('.w3f-panel').style.transform).toBe(
      'translate(60px, 40px)',
    );
  });

  it('switches the editor to the zone where a dragged block is dropped', async () => {
    render(
      <EditorProvider storage={memoryStorageAdapter()} canEdit>
        <EditableZone id="first-zone" />
        <EditableZone id="second-zone" />
        <EditorUI />
      </EditorProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: /edit website/i }));
    await waitFor(() => {
      expect(useEditorStore.getState().layouts['first-zone']).toBeTruthy();
      expect(useEditorStore.getState().layouts['second-zone']).toBeTruthy();
    });

    const dataTransfer = {
      values: {},
      setData(type, value) {
        this.values[type] = value;
      },
      getData(type) {
        return this.values[type] || '';
      },
    };
    fireEvent.dragStart(screen.getByRole('button', { name: /Text/ }), { dataTransfer });
    fireEvent.drop(document.querySelector('[data-web3fiber-zone="second-zone"]'), { dataTransfer });

    await waitFor(() => {
      expect(useEditorStore.getState().layouts['second-zone'].blocks).toHaveLength(1);
      expect(screen.getByRole('combobox', { name: 'Choose editable zone' }).value).toBe('second-zone');
    });

    fireEvent.change(screen.getByRole('combobox', { name: 'Choose editable zone' }), {
      target: { value: 'first-zone' },
    });
    fireEvent.click(screen.getByText('Your text goes here', { selector: 'p' }));
    expect(screen.getByRole('combobox', { name: 'Choose editable zone' }).value).toBe('second-zone');
    expect(screen.getByRole('textbox').value).toBe('Your text goes here');
    fireEvent.change(screen.getByLabelText('Font family'), {
      target: { value: 'Georgia' },
    });
    expect(
      screen.getByText('Your text goes here', { selector: 'p' }).style.fontFamily,
    ).toBe('Georgia');
  });
});
