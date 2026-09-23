'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question: 'Is Clinsight a medical diagnosis tool?',
    answer:
      'No, Clinsight is an informational tool designed to help you understand your laboratory results. It is not a substitute for professional medical advice, diagnosis, or treatment.',
  },
  {
    question: 'How accurate are the AI insights?',
    answer:
      'Clinsight uses structured medical interpretation principles to provide helpful insights. For additional confidence, you can request a doctor review.',
  },
  {
    question: 'Is my medical data safe?',
    answer:
      'Yes, we take data security very seriously. Your medical information is encrypted and handled according to strict privacy standards to ensure your data remains confidential.',
  },
  {
    question: 'Can I speak to a doctor through Clinsight?',
    answer:
      'Yes, Clinsight provides an optional service where you can request a review and consultation with a medical professional for added clarity.',
  },
  {
    question: 'Do I need to pay before seeing my results?',
    answer:
      'Clinsight offers a transparent pricing model. Basic insights may be available, while detailed AI analysis or consultations may require a fee.',
  },
  {
    question: "What if I don't understand the results?",
    answer:
      "If you find any part of the analysis confusing, we recommend using our 'Request Consultation' feature to speak with a doctor.",
  },
];

export function FAQ() {
  return (
    <section className="bg-[#FFFFFE] py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16 flex flex-col items-center text-center gap-4 lg:gap-6">
          <div className="flex w-fit h-auto items-center justify-center gap-2 rounded-full bg-[#E8F0F9] px-4 py-2 border border-slate-50">
            <span className="h-2 w-2 bg-[#1565C0]" />
            <span className="text-[10px] lg:text-xs font-bold text-[#1565C0] capitalize tracking-wider">
              FAQs
            </span>
          </div>

          <h2 className="mb-4 lg:mb-6 text-[22px] lg:text-[40px] font-bold leading-tight tracking-tight text-[#1B1B1B]">
            Frequently Asked Questions
          </h2>

          <p className="max-w-2xl text-[14px] lg:text-[18px] font-normal leading-relaxed text-[#5E5E5E]">
            Explore answers to common questions about your results, features, and how Clinsight
            supports your care
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto w-full max-w-2xl">
          <Accordion type="single" collapsible className="w-full space-y-4 border-none">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-[16px] border border-[#D0D0D0] bg-white transition-all data-[state=open]:bg-white data-[state=open]:shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="py-5 px-5 hover:no-underline focus:ring-0 focus:outline-none text-[16px] lg:text-[18px] font-bold text-[#1B1B1B] text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-[14px] lg:text-[16px] font-normal leading-relaxed text-[#5E5E5E]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
