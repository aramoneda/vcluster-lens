import * as React from 'react';
import { Modal } from '../Modal/Modal';
import styles from './WidgetZoomModal.module.css';

export interface WidgetZoomModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback when the modal open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Widget title to display in the modal header
   */
  title: string;
  /**
   * The widget content to display in L size
   */
  children: React.ReactNode;
}

/**
 * WidgetZoomModal - A modal component for displaying widget content in expanded L size view.
 * Used when clicking the zoom button on a widget.
 */
export const WidgetZoomModal: React.FC<WidgetZoomModalProps> = ({
  open,
  onOpenChange,
  title,
  children,
}) => {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Portal>
        <Modal.Overlay />
        <Modal.Content
          size="lg"
          titleText={title}
          hideFooter
          className={styles.zoomModalContent}
        >
          <div className={styles.widgetContent}>
            {children}
          </div>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  );
};

WidgetZoomModal.displayName = 'WidgetZoomModal';

export default WidgetZoomModal;

