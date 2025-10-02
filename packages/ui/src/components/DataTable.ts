import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface DataTableColumn<T = unknown> {
  key: string;
  header: string;
  sortable?: boolean;
  draggable?: boolean;
  // eslint-disable-next-line no-unused-vars
  render?: (_value: unknown, _row: T) => unknown;
  width?: string;
}

export interface DataTableProps<T = unknown> {
  columns: DataTableColumn<T>[];
  data: T[];
  draggableRows?: boolean;
  sortable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  animated?: boolean;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onSort?: (_key: string, _direction: 'asc' | 'desc') => void;
  // eslint-disable-next-line no-unused-vars
  onRowDrag?: (_fromIndex: number, _toIndex: number) => void;
}

export function DataTable<T = unknown>(props: DataTableProps<T>) {
  const {
    columns,
    data,
    draggableRows = true,
    sortable = true,
    striped = true,
    hoverable = true,
    bordered = false,
    compact = false,
    stickyHeader = true,
    animated = true,
    className,
    onSort,
    onRowDrag,
  } = props;

  const sortKey = useState<string | null>(null);
  const sortDirection = useState<'asc' | 'desc'>('asc');
  const draggedRow = useState<number | null>(null);
  const dragOverRow = useState<number | null>(null);

  const handleSort = (key: string) => {
    if (!sortable) return;

    const newDirection = sortKey() === key && sortDirection() === 'asc' ? 'desc' : 'asc';

    sortKey(key);
    sortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handleDragStart = (index: number) => (e: DragEvent) => {
    draggedRow(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (index: number) => (e: DragEvent) => {
    e.preventDefault();
    dragOverRow(index);
  };

  const handleDrop = (index: number) => (e: DragEvent) => {
    e.preventDefault();
    const from = draggedRow();
    if (from !== null && from !== index) {
      onRowDrag?.(from, index);
    }
    draggedRow(null);
    dragOverRow(null);
  };

  return createElement(
    'div',
    { className: cn('solidum-datatable-wrapper', className) },
    createElement(
      'table',
      {
        className: cn('solidum-datatable', {
          'solidum-datatable--striped': striped,
          'solidum-datatable--hoverable': hoverable,
          'solidum-datatable--bordered': bordered,
          'solidum-datatable--compact': compact,
          'solidum-datatable--animated': animated,
        }),
      },
      // Header
      createElement(
        'thead',
        { className: cn({ 'solidum-datatable-header--sticky': stickyHeader }) },
        createElement(
          'tr',
          {},
          draggableRows && createElement('th', { className: 'solidum-datatable-drag-handle' }),
          ...columns.map(col =>
            createElement(
              'th',
              {
                className: cn('solidum-datatable-header', {
                  'solidum-datatable-header--sortable': sortable && col.sortable !== false,
                  'solidum-datatable-header--sorted': sortKey() === col.key,
                }),
                style: col.width ? { width: col.width } : {},
                onClick: sortable && col.sortable !== false ? () => handleSort(col.key) : undefined,
              },
              col.header,
              sortable &&
                col.sortable !== false &&
                sortKey() === col.key &&
                createElement(
                  'span',
                  { className: 'solidum-datatable-sort-icon' },
                  sortDirection() === 'asc' ? ' ▲' : ' ▼'
                )
            )
          )
        )
      ),
      // Body
      createElement(
        'tbody',
        {},
        ...data.map((row, index) =>
          createElement(
            'tr',
            {
              className: cn('solidum-datatable-row', {
                'solidum-datatable-row--dragging': draggedRow() === index,
                'solidum-datatable-row--drag-over': dragOverRow() === index,
              }),
              draggable: draggableRows,
              onDragStart: draggableRows ? handleDragStart(index) : undefined,
              onDragOver: draggableRows ? handleDragOver(index) : undefined,
              onDrop: draggableRows ? handleDrop(index) : undefined,
            },
            draggableRows &&
              createElement('td', { className: 'solidum-datatable-drag-handle' }, '⋮⋮'),
            ...columns.map(col => {
              const value = (row as Record<string, unknown>)[col.key];
              const rendered = col.render ? col.render(value, row) : value;
              return createElement('td', { className: 'solidum-datatable-cell' }, rendered);
            })
          )
        )
      )
    ),
    draggableRows &&
      createElement('div', { className: 'solidum-datatable-hint' }, '↕ Drag rows to reorder')
  );
}
