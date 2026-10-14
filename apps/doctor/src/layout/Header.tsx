'use client';

import { ArrowDown01Icon, Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DutyStatusToggle from '@/components/doctor/DutyStatusToggle';
import { getCurrentUser } from '@/lib/auth';
import { fetchVerificationStatus, getAvailability } from '@/services/doctor/service';

function UserHeader({
  onMenuToggle,
  isSidebarOpen,
}: {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}) {
  const [isOnDuty, setIsOnDuty] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [notificationCount] = useState<number>(0);
  const [doctorName, setDoctorName] = useState<string>('');

  useEffect(() => {
    async function loadHeaderState() {
      const user = await getCurrentUser();
      if (user) {
        const name = user.first_name
          ? `${user.first_name} ${user.last_name || ''}`.trim()
          : user.name || user.email?.split('@')[0] || '';
        setDoctorName(name);
      }
      const verif = await fetchVerificationStatus();
      if (verif) {
        setIsApproved(verif.status === 'approved' || verif.status === 'verified');
      }
      const avail = await getAvailability();
      if (avail) {
        setIsOnDuty(avail.isOnDuty);
      }
    }
    loadHeaderState();
  }, []);

  return (
    <header className="min-h-18 sm:min-h-23 w-full bg-[#FFFFFE] border border-l-0 border-[#F0F0F0] p-4 lg:px-10 md:px-6 sm:py-6.25 flex justify-between items-center gap-5 sm:gap-2.5 sm:flex-row">
      <h1 className="hidden sm:block sm:text-2xl lg:text-[32px] font-semibold">
        Welcome {doctorName ? `Dr. ${doctorName}` : 'Doctor'}
      </h1>
      <div className="flex items-center max-sm:w-full max-sm:justify-between">
        <Image
          src="/assets/dashboard/vector-new.svg"
          className="sm:hidden"
          width={116}
          height={40}
          alt="Logo"
        />

        <div className="flex gap-2.5 md:gap-4 lg:gap-6.25 items-center">
          <DutyStatusToggle
            isOnDuty={isOnDuty}
            disabled={!isApproved}
            disabledReason="Approval required: Your doctor verification must be approved before you can go on duty."
            onToggle={() => setIsOnDuty((prev) => !prev)}
          />
          <button className="flex relative">
            <Image
              src="/assets/dashboard/bell.svg"
              className="shrink-0"
              alt="Notifications"
              width={24}
              height={24}
            />
            <span
              className={`${notificationCount < 1 ? 'hidden' : ''} absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 size-4 sm:h-4 sm:w-4 p-1 rounded-full bg-primary-blue text-white text-[8px] sm:text-xs flex items-center justify-center`}
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          </button>
          <button className="hidden sm:flex py-1 px-2.5 rounded-[10px] border border-[#D0D0D0] justify-between items-center gap-3">
            <Image src="/assets/dashboard/doc.png" width={36} height={36} alt="Doctor Avatar" />
            <HugeiconsIcon icon={ArrowDown01Icon} />
          </button>
          <button
            className="sm:hidden flex items-center justify-center p-2"
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => onMenuToggle()}
          >
            {isSidebarOpen ? (
              <HugeiconsIcon icon={Cancel01Icon} />
            ) : (
              <HugeiconsIcon icon={Menu01Icon} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Header({
  user,
  onMenuToggle,
  isSidebarOpen,
}: {
  user: 'Doctor';
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}) {
  return (
    <>
      {user === 'Doctor' && (
        <UserHeader onMenuToggle={onMenuToggle} isSidebarOpen={isSidebarOpen} />
      )}
    </>
  );
}
