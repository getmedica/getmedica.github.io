// Page navigation
function showPage(pageId) {
  document.querySelectorAll('.container').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
  window.scrollTo(0, 0);
  
  // Initialize date pickers and input masks when apply page is shown
  if (pageId === 'applyPage') {
    initDatePickers();
    initInputMasks();
    initValidation();
    updateProgress();
  }
}

// Initialize date pickers
function initDatePickers() {
  const fromDatePicker = flatpickr("#fromDate", {
    dateFormat: "d-m-Y",
    maxDate: "today",
    onChange: function(selectedDates, dateStr, instance) {
      validateField('fromDate');
      // Set minDate for toDate picker
      toDatePicker.set('minDate', dateStr);
      updateProgress();
    }
  });
  
  const toDatePicker = flatpickr("#toDate", {
    dateFormat: "d-m-Y",
    maxDate: "today",
    onChange: function(selectedDates, dateStr, instance) {
      validateField('toDate');
      updateProgress();
    }
  });
}

// Initialize input masks
function initInputMasks() {
  // Phone/email mask for contact field
  const contactInput = document.getElementById('contact');
  contactInput.addEventListener('blur', function() {
    validateField('contact');
  });
  
  // Transaction ID mask (alphanumeric)
  const transactionInput = document.getElementById('transaction');
  transactionInput.addEventListener('blur', function() {
    validateField('transaction');
  });
}

// Initialize validation
function initValidation() {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this.id);
      updateProgress();
    });
    
    input.addEventListener('input', function() {
      // Clear error when user starts typing
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        document.getElementById(this.id + 'Error').style.display = 'none';
      }
    });
  });
}

// Validate a specific field
function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + 'Error');
  let isValid = true;
  
  // Reset state
  field.closest('.form-group').classList.remove('invalid', 'valid');
  
  // Check if field is empty
  if (!field.value.trim()) {
    isValid = false;
  } else {
    // Field-specific validation
    switch(fieldId) {
      case 'contact':
        const contactValue = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (!emailRegex.test(contactValue) && !phoneRegex.test(contactValue)) {
          errorElement.textContent = 'Please enter a valid email or 10-digit phone number';
          isValid = false;
        }
        break;
        
      case 'fromDate':
      case 'toDate':
        // Dates are validated by flatpickr, just check if they exist
        break;
        
      case 'receipt':
        // File validation would go here
        break;
    }
  }
  
  // Update UI based on validation
  if (!isValid) {
    field.closest('.form-group').classList.add('invalid');
    errorElement.style.display = 'block';
  } else {
    field.closest('.form-group').classList.add('valid');
    errorElement.style.display = 'none';
  }
  
  return isValid;
}

// Validate entire form
function validateForm() {
  const fieldsToValidate = [
    'name', 'father', 'roll', 'class', 'address', 
    'fromDate', 'toDate', 'reason', 'contact', 
    'transaction', 'receipt'
  ];
  
  let isFormValid = true;
  
  fieldsToValidate.forEach(fieldId => {
    if (!validateField(fieldId)) {
      isFormValid = false;
    }
  });
  
  if (isFormValid) {
    showDisclaimer();
  } else {
    // Scroll to first error
    const firstError = document.querySelector('.invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Update progress indicator
function updateProgress() {
  const requiredFields = [
    'name', 'father', 'roll', 'class', 'address', 
    'fromDate', 'toDate', 'reason', 'contact', 
    'transaction'
  ];
  
  let completedFields = 0;
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field && field.value.trim()) {
      completedFields++;
    }
  });
  
  // Check file field separately
  const receiptField = document.getElementById('receipt');
  if (receiptField && receiptField.files.length > 0) {
    completedFields++;
  }
  
  const progressPercentage = (completedFields / requiredFields.length) * 100;
  document.getElementById('progressFill').style.width = progressPercentage + '%';
  
  // Update step indicators
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  
  // Personal info completed
  const personalFields = ['name', 'father', 'roll', 'class', 'address'];
  const personalCompleted = personalFields.every(fieldId => {
    const field = document.getElementById(fieldId);
    return field && field.value.trim();
  });
  
  if (personalCompleted) {
    step1.classList.add('completed');
    step2.classList.add('active');
  } else {
    step1.classList.remove('completed');
    step2.classList.remove('active');
  }
  
  // Dates completed
  const datesCompleted = document.getElementById('fromDate').value && 
                          document.getElementById('toDate').value &&
                          document.getElementById('reason').value;
  
  if (datesCompleted) {
    step2.classList.add('completed');
    step3.classList.add('active');
  } else {
    step2.classList.remove('completed');
    step3.classList.remove('active');
  }
  
  // Payment completed
  const paymentCompleted = document.getElementById('contact').value && 
                            document.getElementById('transaction').value &&
                            document.getElementById('receipt').files.length > 0;
  
  if (paymentCompleted) {
    step3.classList.add('completed');
  } else {
    step3.classList.remove('completed');
  }
}

// Modal functions
function showDisclaimer() {
  document.getElementById("disclaimerModal").style.display = "block";
}

function closeDisclaimer() {
  document.getElementById("disclaimerModal").style.display = "none";
}

async function acceptDisclaimer() {
  const form = document.getElementById("medicalForm");
  const formData = new FormData(form);

  try {
    let response = await fetch("https://www.formbackend.com/f/2090050a3bce2d75", {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      document.getElementById("disclaimerModal").style.display = "none";
      document.getElementById("confirmationModal").style.display = "block";
      form.reset();
    } else {
      alert("❌ Error submitting form. Please try again.");
    }
  } catch (error) {
    alert("⚠️ Network error. Please check your internet.");
  }
}

function closeConfirmation() {
  document.getElementById("confirmationModal").style.display = "none";
}

window.onclick = function(event) {
  const disclaimer = document.getElementById("disclaimerModal");
  const confirmation = document.getElementById("confirmationModal");
  if (event.target == disclaimer) disclaimer.style.display = "none";
  if (event.target == confirmation) confirmation.style.display = "none";
}