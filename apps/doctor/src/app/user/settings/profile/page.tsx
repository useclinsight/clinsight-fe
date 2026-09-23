import EditButton from '@/components/settings/EditButton';
import LogoutSection from '@/components/settings/LogoutSection';
import { Pencil, Plus, Trash } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="px-6 pt-7.5 pb-53.5 space-y-7.5">
      <header className=" font-inter ">
        <h1 className="text-settings-header-text text-[40px] font-bold leading-13 tracking-[-0.8px]">
          {' '}
          Profile
        </h1>
        <p className="text-settings-subheader-text font-medium leading-[150%] tracking-[-0.16px]">
          Manage your personal and professional information
        </p>
      </header>

      <div className="bg-white rounded-settings-radius px-13 pt-13 pb-[149.51px] space-y-[52.94px]">
        <h2 className="py-[6.615px] px-[13.231px] text-center rounded-settings-radius bg-outline-border w-fit text-3xl font-semibold leading-[130%] tracking-[-0.635px]">
          My Profile
        </h2>

        <div className="space-y-[26.46px]">
          {/* Profile section 1 */}
          <div className="profile__sections flex items-center justify-between">
            <div className="flex items-center gap-x-14">
              <div className="size-[190.525px] rounded-full bg-settings-img-placeholder"></div>
              <div className="border">
                <h2 className="font-semibold leading-[130%] tracking-[-0.635px] text-3xl border">
                  Dr. Light Adeyemi
                </h2>
                <p className="text-[23.816px] leading-[150%] tracking-[-0.238px]">
                  Senior Cardiologist
                </p>
                <p className="text-[21.169px] font-medium leading-[150%] tracking-[-0.212px]">
                  Ikeja, Lagos
                </p>
              </div>
            </div>

            <EditButton />
          </div>

          {/* personal information */}
          <div className="profile__sections space-y-[26.46px]">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold leading-normal font-inter text-settings-header-text text-[23.462px]">
                Personal Info
              </h2>
              <EditButton />
            </header>

            <div className="grid grid-cols-2 gap-y-9.75">
              <div className="space-y-[5.29px]">
                <p className="personal_info_title">name</p>
                <p className="personal_info_value">Light</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">surname</p>
                <p className="personal_info_value">Adeyemi</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">email</p>
                <p className="personal_info_value">lightade@medicalcenter.org</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">phone</p>
                <p className="personal_info_value">+234 801 1238 924</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">Bio</p>
                <p className="personal_info_value">Senior Cardiologist</p>
              </div>
            </div>
          </div>

          {/* Address information */}
          <div className="profile__sections space-y-[26.46px]">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold leading-normal font-inter text-settings-header-text text-[23.462px]">
                Address
              </h2>
              <EditButton />
            </header>

            <div className="grid grid-cols-2 gap-y-9.75">
              <div className="space-y-[5.29px]">
                <p className="personal_info_title">country</p>
                <p className="personal_info_value">Nigeria</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">City/state</p>
                <p className="personal_info_value">Ikeja, Lagos</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">Postal Code</p>
                <p className="personal_info_value">000000</p>
              </div>

              <div className="space-y-[5.29px]">
                <p className="personal_info_title">Street</p>
                <p className="personal_info_value">7, James Oluleye Street</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="profile__sections space-y-[26.46px]">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold leading-normal font-inter text-settings-header-text text-[23.462px]">
                About
              </h2>
              <EditButton />
            </header>
            <p className="personal_info_value">
              Dedicated General Practitioner with a focus on precision diagnostics and patient
              centric care. Specializing in family medicine and chronic disease management, I
              leverage digital healthcare tools to provide data-driven insights for my patients.
              Committed to continuous medical education and clinical excellence in the Lagos
              metropolitan area.
            </p>
          </div>

          {/* specialities */}
          <div className="profile__sections space-y-[26.46px]">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold leading-normal font-inter text-settings-header-text text-[23.462px]">
                Specialities
              </h2>
              <EditButton />
            </header>

            <div className="flex items-center gap-[13.23px] flex-wrap">
              {Array.from({ length: 3 }).map((_, idx) => (
                <p
                  key={idx}
                  className="personal_info_value rounded-2xl py-[5.292px] text-[18.523px] px-[21.169px] bg-[#F1F5F9] w-fit"
                >
                  Clinical Pathology
                </p>
              ))}
              <button className="" aria-label="add a new speciality">
                <Plus size={19.846} className="text-primary-blue" />
              </button>
            </div>
          </div>

          {/* Work History */}
          <div className="profile__sections space-y-[26.46px]">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold leading-normal font-inter text-settings-header-text text-[23.462px]">
                Work History
              </h2>

              <button className="flex items-center gap-1 text-[21.169px] leading-[150%] text-primary-blue">
                + <span>Add Experience</span>
              </button>
            </header>

            <div className="space-y-[21.17px]">
              {/* first work history */}
              <div className="border border-text-primary rounded-[6.615px] px-[14.567px] py-[21.171px] flex items-center justify-between">
                <div className="flex items-start gap-[21.17px]">
                  <div className="size-[63.508px] flex items-center justify-center rounded-[6.615px] bg-[#FFFFFE] border">
                    <Image
                      src="/assets/settings/work-history-icon.svg"
                      alt="Work History"
                      width={26.462}
                      height={23.816}
                    />
                  </div>

                  <div>
                    <h1 className="text-settings-header-text text-[21.169px] font-medium leading-[150%] tracking-[-0.212px]">
                      Chief of Cardiology
                    </h1>
                    <p className="text-[#475569] text-[18.523px] font-normal leading-[150%] tracking-[-0.185px]">
                      St. Mary&apos;s General Hospital
                    </p>

                    <p className="text-[#94a3b8] text-[15.877px] italic leading-[150%] tracking-[-0.159px]">
                      Jan 2018 — Present (Current Practice)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-[10.58px]">
                  <Pencil className="size-[17.862px]" />
                  <Trash className="w-[15.877px] h-[17.862px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="profile__sections space-y-[26.46px]">
            <header className="flex items-center justify-between">
              <h2 className="font-semibold leading-normal font-inter text-settings-header-text text-[23.462px]">
                Education
              </h2>

              <button className="flex items-center gap-1 text-[21.169px] leading-[150%] text-primary-blue">
                + <span>Add Education</span>
              </button>
            </header>

            <div className="space-y-[21.17px]">
              {/* first education */}
              <div className="border border-text-primary rounded-[6.615px] px-[14.567px] py-[21.171px] flex items-start justify-between">
                <div className="flex items-start gap-[21.17px]">
                  <div className="size-[63.508px] flex items-center justify-center rounded-[6.615px] bg-[#FFFFFE] border-2">
                    <Image
                      src="/assets/settings/education-icon.svg"
                      alt="Education"
                      width={27.653}
                      height={23.088}
                    />
                  </div>

                  <div>
                    <h1 className="text-settings-header-text text-[21.169px] font-medium leading-[150%] tracking-[-0.212px]">
                      Chief of Cardiology
                    </h1>
                    <p className="text-[#475569] text-[18.523px] font-normal leading-[150%] tracking-[-0.185px]">
                      St. Mary&apos;s General Hospital
                    </p>

                    <p className="text-[#94a3b8] text-[15.877px] italic leading-[150%] tracking-[-0.159px]">
                      Jan 2018 — Present (Current Practice)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-[10.58px]">
                  <Pencil className="size-[17.862px]" />
                  <Trash className="w-[15.877px] h-[17.862px]" />
                </div>
              </div>
            </div>
          </div>

          <LogoutSection />
        </div>
      </div>
    </div>
  );
}
