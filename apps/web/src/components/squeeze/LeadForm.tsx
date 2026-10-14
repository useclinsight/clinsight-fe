'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { submitLeadFormAction } from '@/actions/subscription-actions';
import { cn } from '@/lib/utils';
import { leadFormSchema, type LeadFormValues } from '@/schemas/lead-form-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackGuideDownload } from '@/lib/analytics/ga';
import { trackLead } from '@/lib/analytics/pixel';
import { captureGuestEvent, captureLead, identifyLead } from '@/lib/analytics/posthog';
import { runAnalyticsSafely } from '@/lib/analytics/safe';

export function LeadForm() {
  const guideUrl = '/guides/5-lab-values-every-nigerian-should-understand.pdf';
  const guideFileName = '5-lab-values-every-nigerian-should-understand.pdf';
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');
  const [website, setWebsite] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema as any),
    defaultValues: {
      firstName: '',
      email: '',
    },
  });
  const firstNameField = register('firstName');
  const emailField = register('email');

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const isButtonEnabled = firstName.trim() !== '' && email.trim() !== '';

  useEffect(() => {
    runAnalyticsSafely(() => captureGuestEvent('squeeze_page_viewed'));
  }, []);

  const onSubmit = async (data: LeadFormValues) => {
    if (isLoading) return;
    if (website) return;

    runAnalyticsSafely(() => captureGuestEvent('guide_download_started'));

    setError('');
    setIsLoading(true);

    try {
      const result = await submitLeadFormAction(data);

      if (!result.success && result.status !== 409) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      setIsDone(true);
      runAnalyticsSafely(identifyLead, () => captureLead('guide'), trackLead, trackGuideDownload);
      toast.success('Your guide is ready.');

      // Download directly from the current page. Opening a blank tab before the
      // server action resolves leaves users with an empty tab when popups are
      // blocked or the action fails.
      const downloadLink = document.createElement('a');
      downloadLink.href = guideUrl;
      downloadLink.download = guideFileName;
      downloadLink.rel = 'noopener';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      // Also show the guide in a new tab when the browser allows the
      // post-submit popup. Popup-blocked browsers still retain the download.
      window.open(guideUrl, '_blank', 'noopener,noreferrer');
    } catch {
      const errorMessage = 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-md flex-col gap-3 text-left"
    >
      <input
        tabIndex={-1}
        type="text"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="lead-first-name" className="sr-only">
          First name
        </label>
        <Input
          id="lead-first-name"
          type="text"
          placeholder="Enter your first name"
          {...firstNameField}
          onChange={(e) => {
            setFirstName(e.target.value);
            firstNameField.onChange(e);
          }}
          disabled={isLoading || isDone}
          maxLength={50}
          autoComplete="given-name"
          className="w-full rounded-xl border border-[#E4E4E7] bg-white px-4 py-3.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary-blue focus:outline-none disabled:bg-slate-50"
        />
        {errors.firstName?.message && (
          <p className="mt-1.5 text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lead-email" className="sr-only">
          Email address
        </label>
        <Input
          id="lead-email"
          type="email"
          placeholder="Enter your email address"
          {...emailField}
          onChange={(e) => {
            setEmail(e.target.value);
            emailField.onChange(e);
          }}
          disabled={isLoading || isDone}
          autoComplete="email"
          aria-invalid={Boolean(error || errors.email)}
          aria-describedby={error || errors.email ? 'lead-email-error' : undefined}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50',
            error || errors.email
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#E4E4E7] hover:border-slate-300 focus:border-primary-blue',
          )}
        />
        {(error || errors.email?.message) && (
          <p id="lead-email-error" className="mt-1.5 text-xs text-red-500">
            {error || errors.email?.message}
          </p>
        )}
      </div>

      {isDone && (
        <p
          role="status"
          aria-live="polite"
          className="px-4 text-center text-xs font-semibold leading-relaxed text-[#25B86A]"
        >
          Success! Your guide is ready. Your download should begin automatically.
        </p>
      )}

      <Button
        type="submit"
        disabled={!isButtonEnabled || isLoading || isDone}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all',
          isButtonEnabled && !isLoading && !isDone
            ? 'bg-primary-blue text-white hover:bg-primary-blue/90 active:bg-primary-blue'
            : 'cursor-not-allowed bg-[#DCE8F6] text-[#7FA3D1]',
        )}
      >
        {isLoading ? (
          <>
            <span>Sending...</span>
            <HugeiconsIcon icon={Loading03Icon} className="h-5 w-5 animate-spin" size={20} />
          </>
        ) : (
          <>
            <span>Download Free Guide</span>
            <HugeiconsIcon icon={Download01Icon} className="h-5 w-5" size={20} />
          </>
        )}
      </Button>
    </form>
  );
}
