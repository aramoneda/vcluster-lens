import React from 'react';
import styles from './BreakpointTable.module.css';
import breakpointData from '../../data/breakpoints.json';

export interface BreakpointData {
  gridSize: string;
  device: string;
  breakpointRange: string;
  spacingRules: string;
  columns: number;
  margin: number;
  gutter: number;
  tokenName: string;
}

export interface BreakpointTableProps {
  /**
   * Custom breakpoint data to display. If not provided, uses default data.
   */
  data?: BreakpointData[];
  /**
   * Additional CSS class name
   */
  className?: string;
}

export const BreakpointTable: React.FC<BreakpointTableProps> = ({
  data = breakpointData.breakpoints,
  className,
}) => {
  return (
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Grid Size</th>
            <th className={styles.headerCell}>Device</th>
            <th className={styles.headerCell}>Breakpoint Range</th>
            <th className={styles.headerCell}>Spacing Rules</th>
            <th className={styles.headerCell}>Columns</th>
            <th className={styles.headerCell}>Margin</th>
            <th className={styles.headerCell}>Gutter</th>
            <th className={styles.headerCell}>Token name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((breakpoint, index) => (
            <tr key={breakpoint.tokenName} className={styles.dataRow}>
              <td className={`${styles.dataCell} ${styles.gridSizeCell}`}>
                {breakpoint.gridSize}
              </td>
              <td className={`${styles.dataCell} ${styles.deviceCell}`}>
                {breakpoint.device}
              </td>
              <td className={`${styles.dataCell} ${styles.rangeCell}`}>
                {breakpoint.breakpointRange}
              </td>
              <td className={`${styles.dataCell} ${styles.spacingCell}`}>
                {breakpoint.spacingRules}
              </td>
              <td className={`${styles.dataCell} ${styles.columnsCell}`}>
                {breakpoint.columns}
              </td>
              <td className={`${styles.dataCell} ${styles.marginCell}`}>
                {breakpoint.margin}
              </td>
              <td className={`${styles.dataCell} ${styles.gutterCell}`}>
                {breakpoint.gutter}
              </td>
              <td className={`${styles.dataCell} ${styles.tokenCell}`}>
                <code className={styles.tokenCode}>{breakpoint.tokenName}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BreakpointTable;
