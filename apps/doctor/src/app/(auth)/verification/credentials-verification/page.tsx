'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, Alert02Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import {
  credentialsVerificationSchema,
  type CredentialsVerificationInput,
} from '@/schemas/credentials-verification-schema';
import { Input } from '@/components/ui/input';
import VerificationFileUpload from '@/components/verification/VerificationFileUpload';
import InputFieldContainer from '@/components/ui/InputFieldContainer';
import { useVerification } from '@/components/verification/VerificationContext';
import { submitVerificationAction } from '@/actions/auth-actions';

export default function CredentialsVerificationPage() {
  const router = useRouter();
  const { state: verificationState, updateState, clearState } = useVerification();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CredentialsVerificationInput>({
    resolver: zodResolver(credentialsVerificationSchema as any),
    mode: 'onChange',
    defaultValues: {
      nin: verificationState.nin,
      medicalDegree: verificationState.medicalDegree || undefined,
      mdcnLicense: verificationState.mdcnLicense || undefined,
    },
  });

  const onSubmit = async (data: CredentialsVerificationInput) => {
    // Construct FormData to send files to the server
    const formData = new FormData();
    formData.append('specialization', verificationState.specialization);
    formData.append('yearsOfExperience', verificationState.yearsOfExperience);
    formData.append('hospitalName', verificationState.hospitalName);
    formData.append('address', verificationState.address);
    formData.append('city', verificationState.city);
    formData.append('state', verificationState.state);

    if (verificationState.passportPhoto) {
      formData.append('passportPhoto', verificationState.passportPhoto);
    }

    formData.append('nin', data.nin);

    if (data.medicalDegree) {
      formData.append('medicalDegree', data.medicalDegree);
    }
    if (data.mdcnLicense) {
      formData.append('mdcnLicense', data.mdcnLicense);
    }

    try {
      const result = await submitVerificationAction(formData);
      if (result.success) {
        clearState();
        toast.success('Verification documents submitted successfully!');
        router.push('/verification/verification-complete');
      } else {
        toast.error('Failed to submit verification. Please try again.');
      }
    } catch (e) {
      toast.error('Failed to submit verification. Please try again.');
      console.error(e);
    }
  };

  const handleSave = () => {
    const values = getValues();
    updateState({
      nin: values.nin || '',
      medicalDegree: values.medicalDegree || null,
      mdcnLicense: values.mdcnLicense || null,
    });
    toast.success('Progress saved successfully!');
  };

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* Navigation and Steps */}
      <div className="w-full flex flex-col gap-3 mb-3 select-none">
        <Link
          href="/verification/professional-info"
          className="flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-slate-800 transition-colors w-fit"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="text-xl md:text-2xl font-semibold text-[#1b1b1b] leading-[120%] tracking-tight">
        Verification of Credentials
      </h1>
      <p className="text-xs md:text-sm text-[#5e5e5e] leading-[140%] mt-1 mb-3.5">
        Upload clear copies of the required documents.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3.5">
        {/* NIN */}
        <Controller
          name="nin"
          control={control}
          render={({ field }) => (
            <InputFieldContainer
              label="National Identity Number (NIN)*"
              htmlFor="nin"
              error={errors.nin?.message}
            >
              <Input
                {...field}
                id="nin"
                placeholder="Enter your 11-digit NIN"
                maxLength={11}
                error={!!errors.nin}
              />
            </InputFieldContainer>
          )}
        />

        {/* Medical Degree Certificate */}
        <Controller
          name="medicalDegree"
          control={control}
          render={({ field }) => (
            <InputFieldContainer
              label="Medical Degree Certificate*"
              htmlFor="medicalDegree"
              error={errors.medicalDegree?.message as string}
            >
              <VerificationFileUpload
                label="Medical Degree Certificate"
                acceptText="PDF, PNG, JPG (max 10MB)"
                onChange={field.onChange}
                value={field.value}
              />
            </InputFieldContainer>
          )}
        />

        {/* MDCN License */}
        <Controller
          name="mdcnLicense"
          control={control}
          render={({ field }) => (
            <InputFieldContainer
              label="MDCN License*"
              htmlFor="mdcnLicense"
              error={errors.mdcnLicense?.message as string}
            >
              <VerificationFileUpload
                label="Front of your MDCN license"
                acceptText="PDF, PNG, JPG (max 10MB)"
                onChange={field.onChange}
                value={field.value}
              />
            </InputFieldContainer>
          )}
        />

        {/* Warning Banner */}
        <div className="w-full flex items-start gap-2.5 bg-[#FFF9F0] border border-[#FFE8CC]/40 px-3.5 py-2.5 rounded-xl mt-1">
          <HugeiconsIcon
            icon={Alert02Icon}
            className="w-4.5 h-4.5 text-[#D97706] shrink-0 mt-0.5"
          />
          <span className="text-xs font-medium text-[#D97706] leading-relaxed">
            Ensure all documents are clear and valid. Blurry or expired documents may delay
            verification.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3 mt-2.5 select-none">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 border border-[#E2E8F0] hover:bg-slate-50 text-[#1b1b1b] font-medium text-center rounded-xl transition-all duration-200 cursor-pointer text-xs md:text-sm flex items-center justify-center"
          >
            Save
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 py-2.5 bg-primary-blue hover:bg-blue-1 text-white font-semibold text-center rounded-xl transition-all duration-200 cursor-pointer disabled:bg-[#F5F5F5] disabled:text-text-disabled disabled:cursor-not-allowed text-xs md:text-sm flex items-center justify-center"
          >
            {isSubmitting ? 'Submitting...' : 'Submit to review'}
          </button>
        </div>
      </form>
    </div>
  );
}
