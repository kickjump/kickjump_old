import { useFocusRing } from '@react-aria/focus';
import { useListBox, useListBoxSection, useOption } from '@react-aria/listbox';
import { useSeparator } from '@react-aria/separator';
import { mergeProps } from '@react-aria/utils';
import { type ListProps, type ListState, useListState } from '@react-stately/list';
import { type Node } from '@react-types/shared';
import { useRef } from 'react';

interface ListBoxProps<Item extends object> extends ListProps<Item> {
  label: string;
}

export function ListBox<Item extends object>(props: ListBoxProps<Item>) {
  const state = useListState<Item>(props);
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxProps, labelProps } = useListBox<Item>(props, state, ref);

  return (
    <>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          padding: 0,
          margin: '5px 0',
          listStyle: 'none',
          border: '1px solid gray',
          maxWidth: 250,
        }}
      >
        {[...state.collection].map((item) => (
          <ListBoxSection key={item.key} section={item} state={state} />
        ))}
      </ul>
    </>
  );
}

interface ListBoxSectionProps<Item extends object> {
  section: Node<Item>;
  state: ListState<Item>;
}

function ListBoxSection<Item extends object>(props: ListBoxSectionProps<Item>) {
  const { section, state } = props;
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  });

  const { separatorProps } = useSeparator({
    elementType: 'li',
  });

  // If the section is not the first, add a separator element.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li
          {...separatorProps}
          style={{
            borderTop: '1px solid gray',
            margin: '2px 5px',
          }}
        />
      )}
      <li {...itemProps}>
        {section.rendered && (
          <span
            {...headingProps}
            style={{
              fontWeight: 'bold',
              fontSize: '1.1em',
              padding: '2px 5px',
            }}
          >
            {section.rendered}
          </span>
        )}
        <ul
          {...groupProps}
          style={{
            padding: 0,
            listStyle: 'none',
          }}
        >
          {[...section.childNodes].map((node) => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}

interface OptionProps<Item extends object> {
  item: Node<Item>;
  state: ListState<Item>;
}

function Option<Item extends object>(props: OptionProps<Item>) {
  const { item, state } = props;

  // Get props for the option element
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isDisabled } = useOption({ key: item.key }, state, ref);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      style={{
        background: isSelected ? 'blueviolet' : 'transparent',
        color: isSelected ? 'white' : undefined,
        padding: '2px 5px',
        outline: isFocusVisible ? '2px solid orange' : 'none',
      }}
    >
      {item.rendered}
    </li>
  );
}

export { Item, Section } from '@react-stately/collections';
