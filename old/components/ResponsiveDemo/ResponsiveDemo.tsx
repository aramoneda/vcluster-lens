import React, { useState, useEffect } from 'react';
import styles from './ResponsiveDemo.module.css';
import breakpointData from '../../data/breakpoints.json';

export interface ResponsiveDemoProps {
  /**
   * Show grid overlay
   */
  showGrid?: boolean;
  /**
   * Show breakpoint indicator
   */
  showBreakpoint?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
}

type WidgetSize = 'S' | 'M' | 'L';

interface Widget {
  id: string;
  title: string;
  type: string;
  userSize: WidgetSize;
}

export const ResponsiveDemo: React.FC<ResponsiveDemoProps> = ({
  showGrid = true,
  showBreakpoint = true,
  className,
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', title: 'Revenue', type: 'KPI', userSize: 'S' },
    { id: '2', title: 'Sales Chart', type: 'Chart', userSize: 'M' },
    { id: '3', title: 'Analytics Dashboard', type: 'Dashboard', userSize: 'L' },
    { id: '4', title: 'System Status', type: 'Status', userSize: 'S' },
    { id: '5', title: 'Recent Activity', type: 'List', userSize: 'M' },
    { id: '6', title: 'Conversion', type: 'Metric', userSize: 'S' },
    { id: '7', title: 'Data Table', type: 'Table', userSize: 'L' },
    { id: '8', title: 'Quick Form', type: 'Form', userSize: 'M' },
  ]);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      let breakpoint = '';
      if (width >= 1920) {
        breakpoint = '2XL';
      } else if (width >= 1600) {
        breakpoint = 'XL';
      } else if (width >= 1280) {
        breakpoint = 'L';
      } else if (width >= 768) {
        breakpoint = 'M';
      } else {
        breakpoint = 'S';
      }
      setCurrentBreakpoint(breakpoint);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const getCurrentBreakpointData = () => {
    return breakpointData.breakpoints.find(bp => bp.gridSize === currentBreakpoint);
  };

  const handleWidgetResize = (widgetId: string, newSize: WidgetSize) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, userSize: newSize } : widget
    ));
  };

  const getNextSize = (currentSize: WidgetSize): WidgetSize => {
    const sizes: WidgetSize[] = ['S', 'M', 'L'];
    const currentIndex = sizes.indexOf(currentSize);
    return sizes[(currentIndex + 1) % sizes.length];
  };

  const currentData = getCurrentBreakpointData();

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'KPI':
      case 'Metric':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.kpiValue}>
              {widget.title === 'Revenue' ? '$24.5K' : '12.3%'}
            </div>
          </>
        );
      case 'Chart':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.chartPlaceholder}></div>
          </>
        );
      case 'Dashboard':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.dashboardPlaceholder}></div>
          </>
        );
      case 'Status':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.statusIndicator}>●</div>
          </>
        );
      case 'List':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.listPlaceholder}>
              <div className={styles.listItem}></div>
              <div className={styles.listItem}></div>
              <div className={styles.listItem}></div>
            </div>
          </>
        );
      case 'Table':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.tablePlaceholder}></div>
          </>
        );
      case 'Form':
        return (
          <>
            <h4>{widget.title}</h4>
            <div className={styles.formPlaceholder}></div>
          </>
        );
      default:
        return <h4>{widget.title}</h4>;
    }
  };

  return (
    <div
      className={`${styles.demoContainer} ${className || ''}`}
      style={{
        '--margin': currentData ? `${currentData.margin}px` : '24px',
      } as React.CSSProperties}
    >
      {showBreakpoint && (
        <div className={styles.breakpointIndicator}>
          <div className={styles.indicatorContent}>
            <span className={styles.currentBreakpoint}>{currentBreakpoint}</span>
            <span className={styles.windowWidth}>{windowWidth}px</span>
            {currentData && (
              <span className={styles.breakpointInfo}>
                {currentData.columns} cols • {currentData.margin}px margin • {currentData.gutter}px gutter
              </span>
            )}
          </div>
        </div>
      )}

      <div className={styles.contentArea}>
        {showGrid && currentData && (
          <div
            className={styles.gridOverlay}
            style={{
              '--columns': currentData.columns,
              '--margin': `${currentData.margin}px`,
              '--gutter': `${currentData.gutter}px`,
            } as React.CSSProperties}
          >
            {Array.from({ length: currentData.columns }, (_, i) => (
              <div key={i} className={styles.gridColumn} />
            ))}
          </div>
        )}

        <div
          className={styles.demoContent}
          style={{
            '--columns': currentData?.columns || 12,
            '--margin': currentData ? `${currentData.margin}px` : '24px',
            '--gutter': currentData ? `${currentData.gutter}px` : '24px',
            '--row-height': '315px',
          } as React.CSSProperties}
        >
          <div className={styles.demoCard}>
            <h3>Responsive Widget Layout Demo</h3>
            <p>Widgets adapt their size based on screen width. Resize to see the responsive behavior.</p>
            <div className={styles.widgetGrid}>
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className={styles.widget}
                  data-user-size={widget.userSize}
                  data-widget-type={widget.type}
                >
                  <div className={styles.widgetContent}>
                    {renderWidgetContent(widget)}
                    <span className={styles.widgetLabel}>Size: {widget.userSize}</span>
                    <button
                      className={styles.resizeButton}
                      onClick={() => handleWidgetResize(widget.id, getNextSize(widget.userSize))}
                      title={`Resize to ${getNextSize(widget.userSize)}`}
                    >
                      ⟲
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDemo;
