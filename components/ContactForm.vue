<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
      <!-- Honeypot field for spam protection (hidden from users) -->
      <input type="text" v-model="honeypot" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="block text-sm font-medium text-neutral mb-1">Full Name <span class="text-red-500">*</span></label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            class="form-input" 
            placeholder="John Doe"
            required
            :aria-invalid="!!errors.name"
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-neutral mb-1">Email Address <span class="text-red-500">*</span></label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            class="form-input" 
            placeholder="john@example.com"
            required
            :aria-invalid="!!errors.email"
          />
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="phone" class="block text-sm font-medium text-neutral mb-1">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone" 
            class="form-input" 
            placeholder="+91 98XXXXXXXX"
            :aria-invalid="!!errors.phone"
          />
          <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
        </div>
        <div>
          <label for="service" class="block text-sm font-medium text-neutral mb-1">Service Interested In</label>
          <select id="service" v-model="form.service" class="form-input">
            <option value="">Select a service</option>
            <option value="General Construction">General Construction</option>
            <option value="Residential Construction">Residential Construction</option>
            <option value="Commercial Construction">Commercial Construction</option>
            <option value="Renovation & Remodeling">Renovation & Remodeling</option>
            <option value="Project Management">Project Management</option>
            <option value="Architectural Design">Architectural Design</option>
            <option value="Interior Design">Interior Design</option>
            <option value="Roofing">Roofing</option>
            <option value="Flooring & Tiling">Flooring & Tiling</option>
            <option value="Painting">Painting</option>
          </select>
        </div>
      </div>

      <div>
        <label for="message" class="block text-sm font-medium text-neutral mb-1">Your Message <span class="text-red-500">*</span></label>
        <textarea 
          id="message" 
          v-model="form.message" 
          rows="5" 
          class="form-input" 
          placeholder="Please describe your project requirements..."
          required
          :aria-invalid="!!errors.message"
        ></textarea>
        <p v-if="errors.message" class="text-xs text-red-500 mt-1">{{ errors.message }}</p>
      </div>

      <!-- Math captcha for spam protection -->
      <div>
        <label for="captcha" class="block text-sm font-medium text-neutral mb-1">
          What is {{ captcha.a }} + {{ captcha.b }}? <span class="text-red-500">*</span>
        </label>
        <input
          id="captcha"
          v-model="captchaInput"
          class="form-input"
          type="number"
          required
          :aria-invalid="!!errors.captcha"
        />
        <p v-if="errors.captcha" class="text-xs text-red-500 mt-1">{{ errors.captcha }}</p>
      </div>

      <div>
        <button 
          type="submit" 
          class="btn-primary w-full md:w-auto min-w-[180px]"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <Icon name="svg-spinners:270-ring" class="w-5 h-5 mr-2" />
            Sending...
          </span>
          <span v-else>
            Send Message
          </span>
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="submitted" class="p-4 bg-success/10 border border-success text-success rounded-md">
        Thank you! Your message has been sent successfully. We will contact you shortly.
      </div>
      <!-- Error Message -->
      <div v-if="errorMsg" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {{ errorMsg }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

/**
 * Contact form state and logic
 * - Uses Formspree for backendless email delivery
 * - Includes honeypot and math captcha for spam protection
 * - Handles validation, error handling, and logging
 * - TODO: Integrate analytics for submission tracking
 */

// --- CONFIGURATION ---
const FORMSPREE_ENDPOINT: string = 'https://formspree.io/f/mpwlaljb'

// --- FORM STATE ---
interface ContactForm {
  name: string
  email: string
  phone: string
  service: string
  message: string
}
const form = reactive<ContactForm>({
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
})
const honeypot = ref<string>('') // For spam protection
const isSubmitting = ref<boolean>(false)
const submitted = ref<boolean>(false)
const errorMsg = ref<string>('')

// --- VALIDATION STATE ---
interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
  captcha?: string
}
const errors = reactive<FormErrors>({})

// --- CAPTCHA STATE ---
const captcha = reactive<{ a: number; b: number }>({
  a: Math.floor(Math.random() * 10) + 1,
  b: Math.floor(Math.random() * 10) + 1
})
const captchaInput = ref<string>('')

/**
 * Validate and sanitize form fields.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateForm(): boolean {
  let valid: boolean = true
  errors.name = errors.email = errors.phone = errors.message = errors.captcha = ''

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required.'
    valid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email.trim())) {
    errors.email = 'Invalid email address.'
    valid = false
  }

  // Phone validation (optional, but sanitize)
  if (form.phone && !/^[\d+\-\s()]{7,20}$/.test(form.phone.trim())) {
    errors.phone = 'Invalid phone number.'
    valid = false
  }

  // Message validation
  if (!form.message.trim()) {
    errors.message = 'Message is required.'
    valid = false
  }

  // Captcha validation
  if (parseInt(captchaInput.value) !== captcha.a + captcha.b) {
    errors.captcha = 'Incorrect answer to the math question.'
    valid = false
  }

  // Honeypot check
  if (honeypot.value) {
    valid = false
    // Log spam attempt
    // eslint-disable-next-line no-console
    console.warn('Spam detected: honeypot field filled')
  }

  return valid
}

/**
 * Reset the form and captcha.
 * @returns {void}
 */
function resetForm(): void {
  Object.keys(form).forEach(key => {
    form[key as keyof ContactForm] = ''
  })
  captcha.a = Math.floor(Math.random() * 10) + 1
  captcha.b = Math.floor(Math.random() * 10) + 1
  captchaInput.value = ''
  honeypot.value = ''
}

/**
 * Handle form submission.
 * @returns {Promise<void>}
 */
async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  errorMsg.value = ''
  submitted.value = false

  // Validate form
  if (!validateForm()) {
    isSubmitting.value = false
    // Log validation errors
    // eslint-disable-next-line no-console
    console.log('Validation failed:', { ...errors })
    return
  }

  // Prepare data for Formspree
  const payload: Record<string, string> = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    service: form.service.trim(),
    message: form.message.trim(),
    _replyto: form.email.trim(), // For Formspree auto-reply
    _subject: `Contact Form Submission: ${form.service || 'General Inquiry'}`,
    _gotcha: honeypot.value // Honeypot field for Formspree
  }

  // Retry mechanism for network errors
  let attempts: number = 0
  const maxAttempts: number = 3
  let success: boolean = false
  while (attempts < maxAttempts && !success) {
    try {
      const response: Response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        throw new Error(`Formspree error: ${response.statusText}`)
      }
      // Optionally check response JSON for errors
      success = true
      submitted.value = true
      resetForm()
      // Basic event log
      // eslint-disable-next-line no-console
      console.log('Contact form submitted successfully')
    } catch (err: any) {
      attempts++
      // Log error for debugging/monitoring
      // eslint-disable-next-line no-console
      console.error('Contact form submission error:', err)
      if (attempts >= maxAttempts) {
        errorMsg.value = 'Failed to send message. Please try again later.'
      }
      // Exponential backoff for retry
      await new Promise(resolve => setTimeout(resolve, 500 * attempts))
    }
  }

  isSubmitting.value = false

  // Hide success message after 5 seconds
  if (submitted.value) {
    setTimeout(() => {
      submitted.value = false
    }, 5000)
  }
}
</script>