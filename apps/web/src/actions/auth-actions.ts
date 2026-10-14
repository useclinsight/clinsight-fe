'use server';

const SIGNUP_URL =
  process.env.NEXT_PUBLIC_SIGNUP_API_URL ||
  'https://api.staging.useclinsight.com/api/v1/auth/doctor/signup';
const SIGNIN_URL =
  process.env.NEXT_PUBLIC_SIGNIN_API_URL ||
  'https://api.staging.useclinsight.com/api/v1/auth/doctor/login';
const VERIFY_OTP_URL =
  process.env.NEXT_PUBLIC_VERIFY_OTP_API_URL ||
  'https://api.staging.useclinsight.com/api/v1/auth/verify-otp';
const RESEND_OTP_URL =
  process.env.NEXT_PUBLIC_RESEND_OTP_API_URL ||
  'https://api.staging.useclinsight.com/api/v1/auth/resend-otp';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const RECOGNIZED_AUTH_FIELDS = new Set([
  'first_name',
  'firstName',
  'last_name',
  'lastName',
  'email',
  'password',
  'confirm_password',
  'confirmPassword',
  'otp',
  'code',
  'username',
  'specialization',
  'yoe',
  'years_of_experience',
  'current_hospital',
  'currentHospital',
  'passport_photograph',
  'passportPhotograph',
  'license_number',
  'licenseNumber',
  'mdcn_license',
  'nin',
  'medical_license',
  'medicalLicense',
]);

function extractErrorMessage(err: unknown, defaultError: string): string {
  if (!err || typeof err !== 'object') {
    return defaultError;
  }

  const errObj = err as Record<string, unknown>;

  // Helper to format field name: first_name -> First Name
  const formatFieldName = (name: string) => {
    return name.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // 1. Check direct field error structures (errors or details)
  const nestedErrors = errObj.errors || errObj.details || errObj.detail;
  if (nestedErrors) {
    if (Array.isArray(nestedErrors)) {
      // FastAPI style validation array: [{ loc: [...], msg: "..." }]
      const parsed = nestedErrors
        .map((d: unknown) => {
          if (d && typeof d === 'object') {
            const dObj = d as Record<string, unknown>;
            const loc = dObj.loc;
            const field = Array.isArray(loc) && loc.length > 0 ? String(loc[loc.length - 1]) : '';
            const fieldName = field ? formatFieldName(field) : '';
            let msg = typeof dObj.msg === 'string' ? dObj.msg : JSON.stringify(d);
            if (field) {
              msg = msg.replace(new RegExp(escapeRegExp(field), 'gi'), fieldName);
              msg = msg.replace(new RegExp(escapeRegExp(field.replace('_', ' ')), 'gi'), fieldName);
            }
            if (fieldName && msg.toLowerCase().startsWith(fieldName.toLowerCase())) {
              return msg.charAt(0).toUpperCase() + msg.slice(1);
            }
            return fieldName ? `${fieldName}: ${msg}` : msg;
          }
          return String(d);
        })
        .filter(Boolean)
        .join('; ');
      if (parsed) return parsed;
    } else if (typeof nestedErrors === 'object' && nestedErrors !== null) {
      const parsed = Object.entries(nestedErrors)
        .map(([field, msgs]) => {
          const msgList = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
          const fieldName = formatFieldName(field);
          let cleanMsg = msgList;
          cleanMsg = cleanMsg.replace(new RegExp(escapeRegExp(field), 'gi'), fieldName);
          cleanMsg = cleanMsg.replace(
            new RegExp(escapeRegExp(field.replace('_', ' ')), 'gi'),
            fieldName,
          );

          if (cleanMsg.toLowerCase().startsWith(fieldName.toLowerCase())) {
            return cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
          }
          return `${fieldName} ${cleanMsg}`;
        })
        .filter(Boolean)
        .join('; ');
      if (parsed) return parsed;
    } else if (typeof nestedErrors === 'string') {
      return nestedErrors;
    }
  }

  // 2. Check root-level field errors (e.g. { first_name: ["exceeds maximum length."] })
  const rootFieldErrors: string[] = [];
  for (const [key, val] of Object.entries(errObj)) {
    if (
      [
        'error',
        'message',
        'status',
        'code',
        'success',
        'ok',
        'detail',
        'details',
        'errors',
      ].includes(key)
    ) {
      continue;
    }

    // Restrict this branch to recognized auth/onboarding fields or validation-shaped values
    const isValidationShaped = Array.isArray(val) && val.every((item) => typeof item === 'string');
    if (!RECOGNIZED_AUTH_FIELDS.has(key) && !isValidationShaped) {
      continue;
    }

    const fieldName = formatFieldName(key);
    if (Array.isArray(val)) {
      const msgList = val.join(', ');
      let cleanMsg = msgList;
      cleanMsg = cleanMsg.replace(new RegExp(escapeRegExp(key), 'gi'), fieldName);
      cleanMsg = cleanMsg.replace(new RegExp(escapeRegExp(key.replace('_', ' ')), 'gi'), fieldName);

      if (cleanMsg.toLowerCase().startsWith(fieldName.toLowerCase())) {
        rootFieldErrors.push(cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1));
      } else {
        rootFieldErrors.push(`${fieldName} ${cleanMsg}`);
      }
    } else if (typeof val === 'string') {
      let cleanMsg = val;
      cleanMsg = cleanMsg.replace(new RegExp(escapeRegExp(key), 'gi'), fieldName);
      cleanMsg = cleanMsg.replace(new RegExp(escapeRegExp(key.replace('_', ' ')), 'gi'), fieldName);

      if (cleanMsg.toLowerCase().startsWith(fieldName.toLowerCase())) {
        rootFieldErrors.push(cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1));
      } else {
        rootFieldErrors.push(`${fieldName} ${cleanMsg}`);
      }
    }
  }
  if (rootFieldErrors.length > 0) {
    return rootFieldErrors.join('; ');
  }

  // 3. Fallback to standard top-level error strings
  if (typeof errObj.error === 'string') return errObj.error;
  if (typeof errObj.message === 'string') return errObj.message;

  return JSON.stringify(err) || defaultError;
}

async function handleApiResponse(response: Response, defaultError: string) {
  if (!response.ok) {
    let errorMessage = defaultError;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        const err = await response.json();
        errorMessage = extractErrorMessage(err, defaultError);
      } catch {
        errorMessage = (await response.text()) || defaultError;
      }
    } else {
      errorMessage = (await response.text()) || defaultError;
    }
    return { error: errorMessage };
  }

  try {
    const data = await response.json();
    return { success: true, data };
  } catch {
    return { success: true, data: null };
  }
}

export async function verifyOtpAction(email: string, code: string) {
  if (!email) return { error: 'Email is required for verification.' };
  if (!code || code.length !== 6) {
    return { error: 'Invalid OTP. Please enter a 6-digit code.' };
  }

  console.log(`Verifying OTP for ${email}: ${code} at ${VERIFY_OTP_URL}`);

  try {
    const response = await fetch(VERIFY_OTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose: 'email_verification', role: 'doctor' }),
    });

    const result = await handleApiResponse(response, 'Verification failed');
    if (result.error) {
      console.error('OTP Verification API Error:', result.error);
    }
    return result;
  } catch (error) {
    console.error('OTP Verification Network Error:', error);
    return { error: 'Something went wrong. Please check your connection, and try again.' };
  }
}

export async function signupAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (
    !data.firstName?.trim() ||
    !data.lastName?.trim() ||
    !data.email?.trim() ||
    !data.password ||
    !data.confirmPassword
  ) {
    return { error: 'All fields are required.' };
  }
  if (data.password !== data.confirmPassword) {
    return { error: 'Passwords do not match.' };
  }
  if (data.password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(data.password)) {
    return { error: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[^A-Za-z0-9]/.test(data.password)) {
    return { error: 'Password must contain at least one special character.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return { error: 'Invalid email address.' };
  }

  try {
    const response = await fetch(SIGNUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      }),
    });

    return await handleApiResponse(response, 'Signup failed');
  } catch (error) {
    console.error('Signup Error:', error);
    return { error: 'Something went wrong. Please check your connection, and try again' };
  }
}

export async function signinAction(data: { email: string; password: string }) {
  try {
    const response = await fetch(SIGNIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    return await handleApiResponse(response, 'Signin failed');
  } catch (error) {
    console.error('Signin Error:', error);
    return { error: 'Something went wrong, please check your connection and try again' };
  }
}

export async function resendOtpAction(email: string) {
  if (!email) return { error: 'Email is required to resend OTP.' };

  try {
    const response = await fetch(RESEND_OTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        purpose: 'email_verification',
        role: 'doctor',
      }),
    });

    return await handleApiResponse(response, 'Failed to resend OTP');
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return { error: 'Something went wrong, please check your connection and try again' };
  }
}

export async function getGoogleAuthUrlAction() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_API_URL ||
    'https://api.staging.useclinsight.com/api/v1/auth/google'
  );
}

export async function submitVerificationAction(formData: FormData) {
  const passportPhoto = formData.get('passportPhoto') as File | null;
  const medicalDegree = formData.get('medicalDegree') as File | null;
  const mdcnLicense = formData.get('mdcnLicense') as File | null;

  console.log('--- Verification Submission Received (Telemetry) ---');
  console.log('Specialization:', formData.get('specialization'));
  console.log('Years of Experience:', formData.get('yearsOfExperience'));
  console.log('State:', formData.get('state'));
  console.log('Passport Photo Submitted:', !!passportPhoto);
  console.log('Medical Degree Submitted:', !!medicalDegree);
  console.log('MDCN License Submitted:', !!mdcnLicense);

  // Simulate server processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { success: true };
}
