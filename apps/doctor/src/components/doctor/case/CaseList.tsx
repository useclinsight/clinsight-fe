'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { Case } from '@/services/doctor';

export default function CaseList({ cases }: { cases: Case[] }) {
  return (
    <div className="flex flex-col gap-5 pt-2.5 pb-10 px-2.5">
      <div className="flex items-center justify-between bg-white p-5 rounded-t-[20px] border border-[#F0F0F0]">
        <h3 className="text-lg md:text-xl font-medium">All Cases</h3>
      </div>

      <div className="rounded-b-[20px] bg-white border border-[#F0F0F0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="min-w-220 w-full table-auto text-left">
            <thead className="bg-[#FAFAFA]">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-secondary-3 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-6 py-4 text-sm font-bold text-secondary-3 uppercase tracking-wider">
                  Time Assigned
                </th>
                <th className="px-6 py-4 text-sm font-bold text-secondary-3 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-bold text-secondary-3 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-4 text-sm font-bold text-secondary-3 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr
                  key={item.id}
                  className="border-t last:border-b group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.avatar}
                        alt={item.patientName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <Link
                        href={`/user/case/${item.id}`}
                        className="font-medium text-[#1B1B1B] hover:text-primary-blue hover:underline transition-colors"
                      >
                        {item.patientName}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.timeAssigned}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        item.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#FEF0DA] text-[#935F07]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-sm text-[#1B1B1B]">{item.condition}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      aria-label="row actions"
                      className="p-2 rounded-full hover:bg-slate-200 transition-colors focus:outline-none"
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
