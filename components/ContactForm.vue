<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6">
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
          />
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
          />
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
          />
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
        ></textarea>
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
    </form>
  </div>
</template>

<script setup lang="ts">
// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
});

const isSubmitting = ref(false);
const submitted = ref(false);

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true;
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Reset form and show success message
  isSubmitting.value = false;
  submitted.value = true;
  
  // Reset form
  Object.keys(form).forEach(key => {
    form[key as keyof typeof form] = '';
  });
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    submitted.value = false;
  }, 5000);
};
</script>
