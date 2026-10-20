'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  professionalInfoSchema,
  type ProfessionalInfoInput,
} from '@/schemas/professional-info-schema';
import Dropdown from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/input';
import VerificationFileUpload from '@/components/verification/VerificationFileUpload';
import InputFieldContainer from '@/components/ui/InputFieldContainer';
import { useVerification } from '@/components/verification/VerificationContext';

const SPECIALIZATIONS = [
  'General Medicine',
  'Endocrinology',
  'Cardiology',
  'Nephrology',
  'Haematology',
  'Pediatrics',
  'Obstetrics and Gynaecology',
];

const EXPERIENCE_RANGES = [
  'Less than 1 year',
  '1-3 years',
  '4-7 years',
  '8-10 years',
  '11-15 years',
  '16-20 years',
  '21+ years',
];

export default function ProfessionalInfoPage() {
  const router = useRouter();
  const { state: verificationState, updateState } = useVerification();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ProfessionalInfoInput>({
    resolver: zodResolver(professionalInfoSchema as any),
    mode: 'onChange',
    defaultValues: {
      specialization: verificationState.specialization,
      yearsOfExperience: verificationState.yearsOfExperience,
      hospitalName: verificationState.hospitalName,
      address: verificationState.address,
      city: verificationState.city,
      state: verificationState.state,
      passportPhoto: verificationState.passportPhoto || undefined,
    },
  });

  const onSubmit = (data: ProfessionalInfoInput) => {
    updateState({
      specialization: data.specialization,
      yearsOfExperience: data.yearsOfExperience,
      hospitalName: data.hospitalName,
      address: data.address,
      city: data.city,
      state: data.state,
      passportPhoto: data.passportPhoto,
    });
    router.push('/verification/credentials-verification');
  };

  const handleSave = () => {
    const values = getValues();
    updateState({
      specialization: values.specialization || '',
      yearsOfExperience: values.yearsOfExperience || '',
      hospitalName: values.hospitalName || '',
      address: values.address || '',
      city: values.city || '',
      state: values.state || '',
      passportPhoto: values.passportPhoto || null,
    });
    toast.success('Progress saved successfully!');
  };

  return (
    <div className="w-full flex flex-col justify-start items-start [&_label]:text-lg [&_input]:h-14">
      {/* Heading */}
      <h1 className="text-2xl md:text-4xl font-semibold text-[#1b1b1b] leading-[120%] tracking-tight">
        Professional Information
      </h1>
      <p className="text-sm md:text-base text-[#5e5e5e] leading-[150%] mt-4 mb-6">
        Complete your professional profile by providing your specialty, years of experience, current
        practice information, and a recent passport photograph.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5 [&>div>div>button]:min-h-14"
      >
        {/* Specialization */}
        <Controller
          name="specialization"
          control={control}
          render={({ field }) => (
            <InputFieldContainer
              label="Specialization*"
              htmlFor="specialization"
              error={errors.specialization?.message}
            >
              <Dropdown
                options={SPECIALIZATIONS}
                placeholder="Select your specialization"
                value={field.value}
                onChange={field.onChange}
              />
            </InputFieldContainer>
          )}
        />

        {/* Years of Experience */}
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <InputFieldContainer
              label="Years of Experience*"
              htmlFor="yearsOfExperience"
              error={errors.yearsOfExperience?.message}
            >
              <Dropdown
                options={EXPERIENCE_RANGES}
                placeholder="Select your experience"
                value={field.value}
                onChange={field.onChange}
              />
            </InputFieldContainer>
          )}
        />

        {/* Section Header: Current Practice Details */}
        <div className="w-full pt-1">
          <h2 className="text-lg font-semibold text-[#1b1b1b]">Current Practice Details</h2>
        </div>

        {/* Hospital Name */}
        <Controller
          name="hospitalName"
          control={control}
          render={({ field }) => (
            <InputFieldContainer
              label="Practice / Hospital Name*"
              htmlFor="hospitalName"
              error={errors.hospitalName?.message}
            >
              <Input
                {...field}
                id="hospitalName"
                placeholder="Enter practice / hospital name"
                error={!!errors.hospitalName}
              />
            </InputFieldContainer>
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <InputFieldContainer label="Address*" htmlFor="address" error={errors.address?.message}>
              <Input
                {...field}
                id="address"
                placeholder="Enter hospital address"
                error={!!errors.address}
              />
            </InputFieldContainer>
          )}
        />

        {/* City and State grid */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <InputFieldContainer label="City*" htmlFor="city" error={errors.city?.message}>
                <Input {...field} id="city" placeholder="City" error={!!errors.city} />
              </InputFieldContainer>
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <InputFieldContainer label="State*" htmlFor="state" error={errors.state?.message}>
                <Input {...field} id="state" placeholder="State" error={!!errors.state} />
              </InputFieldContainer>
            )}
          />
        </div>

        {/* Passport Photo */}
        <Controller
          name="passportPhoto"
          control={control}
          render={({ field }) => (
            <InputFieldContainer label="Passport Photograph*" htmlFor="passportPhoto">
              <VerificationFileUpload
                id="passportPhoto"
                label="Passport Photograph"
                acceptText="PDF, PNG, JPG (max 10MB)"
                onChange={field.onChange}
                value={field.value}
                error={errors.passportPhoto?.message as string}
              />
            </InputFieldContainer>
          )}
        />

        {/* Action Buttons */}
        <div className="w-full flex gap-4 mt-0 select-none">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 min-h-12 border border-[#E2E8F0] hover:bg-slate-50 text-[#1b1b1b] font-medium text-center rounded-xl transition-all duration-200 cursor-pointer text-sm md:text-base flex items-center justify-center"
          >
            Save
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 min-h-12 bg-primary-blue hover:bg-blue-1 text-white font-semibold text-center rounded-xl transition-all duration-200 cursor-pointer disabled:bg-[#F5F5F5] disabled:text-text-disabled disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
