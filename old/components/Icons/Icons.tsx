import React from 'react';
import {
  Info,
  CheckCircle2, // Using CheckCircle2 for a more distinct success icon
  AlertTriangle,
  AlertCircle,
  Search,
  X, // X is a common icon for close/dismiss
  type LucideProps,
} from 'lucide-react';

// Exporting LucideProps for convenience if other components need it
export type { LucideProps };

// Mapping of icon names to Lucide components
const iconMap = {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Search,
  X,
  // Add other Lucide icons here as needed and ensure they are imported above
};

export type IconName = "Info" | "CheckCircle2" | "AlertTriangle" | "AlertCircle" | "Search" | "X";

interface IconsProps extends LucideProps {
  name: IconName;
}

export const Icons: React.FC<IconsProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Fallback for an unknown icon name, or you could throw an error
    console.warn(`Icon "${name}" not found.`);
    return null; // Or return a default icon
  }

  return <IconComponent {...props} />;
};

// Existing individual icon exports (can be kept or removed if no longer directly used)
export const CrossIcon = (props: LucideProps) => <X {...props} />;
export const InfoIcon = (props: LucideProps) => <Info {...props} />;
export const SuccessIcon = (props: LucideProps) => <CheckCircle2 {...props} />;
export const WarningIcon = (props: LucideProps) => <AlertTriangle {...props} />;
export const ErrorIcon = (props: LucideProps) => <AlertCircle {...props} />;
export const DiscoveryIcon = (props: LucideProps) => <Search {...props} />;

// Add other icons here as needed, preferably from lucide-react for consistency