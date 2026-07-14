import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import styles from './Tabset.module.css';

// --- Prop Types ---

export type TabsetVariant = 'title' | 'medium' | 'small';
export type TabsetOrientation = 'horizontal' | 'vertical';

export interface TabsetRootProps extends RadixTabs.TabsProps {
  /**
   * The variant of the tabset, affecting overall styling and child tab variants.
   * @default 'title'
   */
  variant?: TabsetVariant;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export interface TabsetListProps extends RadixTabs.TabsListProps {
  /**
   * The variant of the tabset, affecting list styling (e.g., spacing).
   * Inherited from Tabset.Root if not provided.
   */
  variant?: TabsetVariant;
  className?: string;
  children?: React.ReactNode;
  // asChild?: boolean; // Removed as per review
  // Orientation is a standard RadixTabs.TabsListProp, no need to redefine unless we add custom logic
}

export interface TabsetTriggerProps extends Omit<RadixTabs.TabsTriggerProps, 'type'> {
  /**
   * The variant of the tab, affecting its specific styling (e.g., typography, size).
   * Inherited from Tabset.Root if not provided.
   */
  variant?: TabsetVariant;
  className?: string;
  children?: React.ReactNode;
  // asChild?: boolean; // Removed as per review
}

export interface TabsetContentProps extends RadixTabs.TabsContentProps {
  className?: string;
  children?: React.ReactNode;
  // asChild?: boolean; // Removed as per review
}

// --- Context for Variant ---
interface TabsetVariantContextValue {
  variant: TabsetVariant;
}

const TabsetVariantContext = React.createContext<TabsetVariantContextValue | undefined>(
  undefined,
);

const useTabsetVariant = (): TabsetVariantContextValue => {
  const context = React.useContext(TabsetVariantContext);
  if (context === undefined) {
    // Fallback if context is not provided, though Root should always provide it.
    return { variant: 'title' };
  }
  return context;
};

// --- Root Component ---
const Root = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.Root>,
  TabsetRootProps
>(({ variant = 'title', className, children, /*asChild,*/ ...props }, forwardedRef) => { // Removed asChild from destructuring
  return (
    <TabsetVariantContext.Provider value={{ variant }}>
      <RadixTabs.Root
        ref={forwardedRef}
        className={clsx(styles.root, className)}
        // asChild={asChild} // Removed asChild prop
        {...props}
      >
        {children}
      </RadixTabs.Root>
    </TabsetVariantContext.Provider>
  );
});
Root.displayName = 'Tabset.Root';

// --- List Component ---
const List = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.List>,
  TabsetListProps
>(({ className, variant: variantProp, /*asChild,*/ ...props }, forwardedRef) => { // Removed asChild from destructuring
  const contextVariant = useTabsetVariant().variant;
  const currentVariant = variantProp || contextVariant;

  return (
    <RadixTabs.List
      ref={forwardedRef}
      className={clsx(
        styles.list,
        styles[`list-${currentVariant}`],
        // Radix applies data-orientation, so CSS can target it directly
        className,
      )}
      // asChild={asChild} // Removed asChild prop
      {...props}
    />
  );
});
List.displayName = 'Tabset.List';

// --- Trigger Component ---
const Trigger = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.Trigger>,
  TabsetTriggerProps
>(({ className, variant: variantProp, children, asChild, ...props }, forwardedRef) => {
  const contextVariant = useTabsetVariant().variant;
  const currentVariant = variantProp || contextVariant;

  return (
    <RadixTabs.Trigger
      ref={forwardedRef}
      className={clsx(
        styles.trigger,
        styles[`trigger-${currentVariant}`],
        className,
      )}
      asChild={asChild}
      {...props}
    >
      <span className={styles.triggerLabel}>{children}</span>
    </RadixTabs.Trigger>
  );
});
Trigger.displayName = 'Tabset.Trigger';

// --- Content Component ---
const Content = React.forwardRef<
  React.ComponentRef<typeof RadixTabs.Content>,
  TabsetContentProps
>(({ className, /*asChild,*/ ...props }, forwardedRef) => { // Removed asChild from destructuring
  return (
    <RadixTabs.Content
      ref={forwardedRef}
      className={clsx(styles.content, className)}
      // asChild={asChild} // Removed asChild prop
      {...props}
    />
  );
});
Content.displayName = 'Tabset.Content';

// --- Composite Export ---
export const Tabset = {
  Root,
  List,
  Trigger,
  Content,
};