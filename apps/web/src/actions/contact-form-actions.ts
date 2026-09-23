'use server';

import { ContactFormDataType, contactSchema } from '@/schemas/contact-form-schema';

// also Add the type of data that is going to be returned from the server, it can be a success message or an error message, it should be the same as the one returned from the server.
export async function sendMessageAction(formData: ContactFormDataType) {
  const validatedData = contactSchema.safeParse(formData);
  if (!validatedData.success) {
    console.error('Validation errors:', validatedData.error);
    return {
      error: 'Invalid form data. Please check your input and try again.',
    };
  }

  const { fullName: full_name, email, subject, message, termsAgreement } = validatedData.data;

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, subject, message, termsAgreement }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit contact form: ${response.statusText}`);
    }

    const responseData = await response.json();

    return {
      success: responseData.message,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);

    return {
      error: 'An error occurred while submitting the form. Please try again later.',
    };
  }
}
