'use client';

import { sendMessageAction } from '@/actions/contact-form-actions';
import Dropdown from '@/components/ui/Dropdown';
import InputFieldContainer from '@/components/ui/InputFieldContainer';
import { ContactFormDataType, contactSchema } from '@/schemas/contact-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'motion/react';
import Link from 'next/link';

import { useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const itemTransition = { duration: 0.3, ease: 'easeOut' as const };

const SUBJECT_OPTIONS = ['General', 'Support', 'Partnership', 'Press'];

export default function ContactForm() {
  const [isSendingMessage, startSendMessageTransition] = useTransition();
  const [website, setWebsite] = useState('');

  const { register, handleSubmit, formState, control, reset } = useForm<ContactFormDataType>({
    resolver: zodResolver(contactSchema as any),
    defaultValues: {
      fullName: '',
      email: '',
      subject: undefined,
      message: '',
      termsAgreement: false,
    },
  });

  const { errors } = formState;
  const formValues = useWatch({ control });

  const isAllInputsFilled = Object.values(formValues).every((value) => {
    if (typeof value === 'boolean') return value === true;
    return value && value.trim() !== '';
  });

  function handleSendMessage(formData: ContactFormDataType) {
    if (website) return;
    startSendMessageTransition(async () => {
      const response = await sendMessageAction(formData);

      if (response.error) {
        toast.error(response.error);
      }

      if (response.success) {
        toast.success(response.success);
        reset();
      }
    });
  }

  return (
    <motion.div
      className="border border-outline-border py-5 px-4 space-y-7.5 rounded-[12px] md:w-[60%] bg-white md:px-7.5 md:py-7.5"
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="text-left space-y-2.5 md:space-y-3.75 ">
        <h2 className="font-semibold text-2xl leading-[130%] tracking=[-2%] text-header-text md:font-semibold md:text-[40px] md:tracking-[-2%] md:leading-[120%]">
          Send us a message
        </h2>
        <p className="text-sm leading-[150%] tracking-[-1%] text-text-disabled md:text-base">
          Fill out the form and we&apos;ll be in touch shortly
        </p>
      </header>

      <form action="" autoComplete="on" onSubmit={handleSubmit(handleSendMessage)}>
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
        <motion.div
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} transition={itemTransition}>
            <InputFieldContainer
              label="First Name *"
              htmlFor="fullName"
              error={errors?.fullName?.message}
            >
              <input
                type="text"
                id="fullName"
                disabled={isSendingMessage}
                autoComplete="given-name"
                className="input__field"
                placeholder="Enter first name"
                {...register('fullName')}
              />
            </InputFieldContainer>
          </motion.div>

          <motion.div variants={itemVariants} transition={itemTransition}>
            <InputFieldContainer
              label="Subject *"
              htmlFor="subject"
              error={errors?.subject?.message}
            >
              <input
                type="text"
                id="subject"
                disabled={isSendingMessage}
                className="input__field"
                placeholder="Add a subject"
                {...register('subject')}
              />
            </InputFieldContainer>
          </motion.div>

          <motion.div variants={itemVariants} transition={itemTransition}>
            <InputFieldContainer
              label="Message *"
              htmlFor="message"
              error={errors?.message?.message}
            >
              <textarea
                id="message"
                autoComplete="off"
                className="input__field h-33 p-2.5"
                disabled={isSendingMessage}
                placeholder="Tell us a little about what you need."
                {...register('message')}
              />
            </InputFieldContainer>
          </motion.div>

          <motion.div variants={itemVariants} transition={itemTransition}>
            <InputFieldContainer
              label="Subject / Enquiry *"
              htmlFor="subject"
              error={errors?.subject?.message}
            >
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={SUBJECT_OPTIONS}
                    placeholder="Select subject"
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                )}
              />
            </InputFieldContainer>
          </motion.div>

          <motion.div variants={itemVariants} transition={itemTransition}>
            <InputFieldContainer
              label="Message *"
              htmlFor="message"
              error={errors?.message?.message}
            >
              <textarea
                id="message"
                autoComplete="off"
                className="input__field h-33 p-2.5 resize-none"
                disabled={isSendingMessage}
                placeholder="Tell us a little about what you need."
                {...register('message')}
              />
            </InputFieldContainer>
          </motion.div>

          <motion.div
            variants={itemVariants}
            transition={itemTransition}
            className="flex items-center gap-3"
          >
            <input
              type="checkbox"
              id="termsAgreement"
              disabled={isSendingMessage}
              {...register('termsAgreement')}
            />
            <p className="text-xs text-text-disabled leading-[150%] tracking-[-1%] md:text-sm">
              I agree that my information will be processed according to{' '}
              <Link href="/privacy-policy" className="font-bold underline">
                Clinsight privacy policy
              </Link>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} transition={itemTransition}>
            <motion.button
              className="bg-primary-blue py-3 px-14 rounded-[12px] text-white text-sm w-full tracking-[-1%] leading-[150%] disabled:opacity-50 cursor-pointer"
              disabled={!isAllInputsFilled || isSendingMessage}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {isSendingMessage ? 'Sending message...' : 'Send message'}
            </motion.button>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
}
