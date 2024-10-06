document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkoutForm");

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

        let valid = true; 

        clearErrors();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const addressInput = document.getElementById("address");
        const cityInput = document.getElementById("city");

        // Validate Name
        const nameRegex = /^[A-Za-z\s]+$/; 
        if (nameInput.value.trim().length < 3 || !nameRegex.test(nameInput.value.trim())) {
            showError("nameError", "Name must be at least 3 characters long and contain only letters.");
            valid = false;
        }

        // Validate Email
        if (!validateEmail(emailInput.value.trim())) {
            showError("emailError", "Please enter a valid email address.");
            valid = false;
        }

        // Validate Address
        if (addressInput.value.trim().length < 5) {
            showError("addressError", "Address must be at least 5 characters long.");
            valid = false;
        }

        // Validate City
        if (cityInput.value.trim().length < 4) {
            showError("cityError", "City must be at least 4 characters long.");
            valid = false;
        }

      
        if (valid) {
            alert("Form submitted successfully!"); 
            checkoutForm.reset(); 
        }
    });

    function showError(errorElementId, errorMessage) {
        const errorElement = document.getElementById(errorElementId);
        errorElement.innerText = errorMessage;
    }

    function clearErrors() {
        document.querySelectorAll(".error").forEach(function (element) {
            element.innerText = ""; 
        });
    }

    function validateEmail(email) {
      
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
