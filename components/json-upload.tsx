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
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Update Inventory</h2>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleInputChange}
          className="hidden"
        />

        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Drop your JSON file here
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          or click to browse from your computer
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          File should be the VM inventory JSON from your PowerShell script
        </p>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : status.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : status.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
            </div>
          )}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
        💡 Tip: Use your Jenkins job to automatically send updated JSON files daily. See AUTOMATION_GUIDE.md for setup
        instructions.
      </p>
    </div>
  );
}
