'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { saveVMData } from '@/lib/indexed-db';

interface UploadStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export function JSONUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>({ type: 'idle', message: '' });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const parseAndValidateJSON = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          // Validate that it's an array of VM objects
          if (!Array.isArray(data)) {
            setStatus({ type: 'error', message: 'JSON must be an array of VMs' });
            resolve(false);
            return;
          }

          if (data.length === 0) {
            setStatus({ type: 'error', message: 'JSON array is empty' });
            resolve(false);
            return;
          }

          // Check if it has expected VM properties
          const firstItem = data[0];
          const requiredFields = ['vm_name', 'vcenter', 'power_state'];
          const hasRequiredFields = requiredFields.every((field) => field in firstItem);

          if (!hasRequiredFields) {
            setStatus({
              type: 'error',
              message: `JSON missing required fields: ${requiredFields.join(', ')}`,
            });
            resolve(false);
            return;
          }

          // Store in IndexedDB (supports larger files than localStorage)
          await saveVMData(data);

          setStatus({
            type: 'success',
            message: `Successfully loaded ${data.length} VMs from inventory`,
          });

          // Trigger reload after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 1500);

          resolve(true);
        } catch (err) {
          setStatus({ type: 'error', message: `Invalid JSON: ${(err as Error).message}` });
          resolve(false);
        }
      };
      reader.onerror = () => {
        setStatus({ type: 'error', message: 'Failed to read file' });
        resolve(false);
      };
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setStatus({ type: 'error', message: 'Please select a JSON file' });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'File size exceeds 50MB limit' });
      return;
    }

    setStatus({ type: 'loading', message: 'Validating JSON file...' });
    await parseAndValidateJSON(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quick Upload</p>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded p-2 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleInputChange}
          className="hidden"
        />

        <Upload className="w-4 h-4 mx-auto text-gray-400" />
        <p className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">
          Drop JSON
        </p>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`p-1 rounded text-xs flex items-center gap-1 ${
            status.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : status.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
          ) : status.type === 'error' ? (
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
          ) : (
            <div className="w-3 h-3 flex-shrink-0">
              <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
            </div>
          )}
          <span className="truncate text-xs">{status.message}</span>
        </div>
      )}
    </div>
  );
}
