'use client';

import { Menu, Bell, Shield } from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded p-1 text-gray-500 hover:text-gray-700 sm:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Administration Portal</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
            <Shield className="h-4 w-4" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-gray-900">Platform Admin</p>
            <p className="text-xs text-gray-500">Superuser</p>
          </div>
        </div>
      </div>
    </header>
  );
}
