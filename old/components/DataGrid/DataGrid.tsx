import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import './DataGrid.css';

export interface DataGridColumn {
  field: string;
  headerName?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
  sortable?: boolean;
  filter?: boolean | string;
  resizable?: boolean;
  cellRenderer?: string | React.ComponentType<any>;
  valueFormatter?: (params: any) => string;
  type?: string;
}

export interface DataGridProps {
  /**
   * Array of data objects to display in the grid
   */
  data: any[];
  /**
   * Column definitions for the grid
   */
  columns: DataGridColumn[];
  /**
   * Height of the grid container
   */
  height?: string | number;
  /**
   * Whether the grid should be responsive
   */
  responsive?: boolean;
  /**
   * Whether to show pagination
   */
  pagination?: boolean;
  /**
   * Number of rows per page when pagination is enabled
   */
  pageSize?: number;
  /**
   * Whether rows should be selectable
   */
  rowSelection?: 'single' | 'multiple' | false;
  /**
   * Whether to enable sorting
   */
  sortable?: boolean;
  /**
   * Whether to enable filtering
   */
  filterable?: boolean;
  /**
   * Whether to enable column resizing
   */
  resizable?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Callback when grid is ready
   */
  onGridReady?: (event: GridReadyEvent) => void;
  /**
   * Callback when row is selected
   */
  onSelectionChanged?: (event: any) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  height = '400px',
  responsive = true,
  pagination = false,
  pageSize = 25,
  rowSelection = false,
  sortable = true,
  filterable = false,
  resizable = false,
  className = '',
  onGridReady,
  onSelectionChanged,
}) => {
  const [rowData] = useState(data);
  const [colDefs] = useState(() =>
    columns.map((col) => ({
      field: col.field,
      headerName: col.headerName || col.field,
      width: col.width,
      minWidth: col.minWidth || 100,
      maxWidth: col.maxWidth,
      flex: col.flex,
      sortable: col.sortable !== undefined ? col.sortable : sortable,
      filter: col.filter !== undefined ? col.filter : filterable,
      resizable: col.resizable !== undefined ? col.resizable : resizable,
      cellRenderer: col.cellRenderer,
      valueFormatter: col.valueFormatter,
    }))
  );

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: '100%',
  };

  return (
    <div
      className={`brd-data-grid ag-theme-alpine ag-theme-brd ${className}`}
      style={containerStyle}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={pagination}
        paginationPageSize={pageSize}
        rowSelection={rowSelection || undefined}
        suppressRowClickSelection={rowSelection === false}
        domLayout={responsive ? 'autoHeight' : 'normal'}
        animateRows={true}
        enableCellTextSelection={true}
        defaultColDef={{
          sortable: sortable,
          filter: filterable,
          resizable: resizable,
        }}
        onGridReady={(params) => {
          if (onGridReady) onGridReady(params);
          params.api.sizeColumnsToFit();
        }}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
};

export default DataGrid;

