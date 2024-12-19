<template>
    <div  v-if="!showPopup" class="popup">
      <div class="header-container">
        <h2>User Registration</h2>
        <button class="close-button" @click="closePopup">
          <i class="fas fa-times"></i> <!-- Font Awesome close icon -->
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="main-user-info">
          <div class="user-input-box">
            <label for="username" class="label-wrapper">
              <img src="@/assets/form/person.png" alt="Username Icon" class="label-icon">
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              v-model="username"
              required
            />
          </div>
          <div class="user-input-box">
            <label for="email" class="label-wrapper">
              <img src="@/assets/form/email.png" alt="Email Icon" class="label-icon">
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              v-model="email"
              required
            />
          </div>
          <div class="user-input-box">
            <label for="idNumber" class="label-wrapper">
              <img src="@/assets/form/id.png" alt="ID Number Icon" class="label-icon">
              <span>ID Number</span>
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              placeholder="Enter ID Number"
              v-model="idNumber"
              required
            />
          </div>
          <div class="user-input-box">
            <label for="phoneNumber" class="label-wrapper">
              <img src="@/assets/form/phone.png" alt="Phone Number Icon" class="label-icon">
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              v-model="phoneNumber"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
              required
            />
          </div>
  
          <div class="user-input-box">
            <label for="organization" class="label-wrapper">
              <img src="@/assets/form/dep.png" alt="Organization Icon" class="label-icon">
              <span>Organization</span>
            </label>
            <select id="organization" name="organization" class="styled-select" required v-model="organization" @change="handleOrganizationChange">
              <option value="" disabled selected>Select Organization</option>
              <option value="Department">Department</option>
              <option value="Special Labs">Special Labs</option>
              <option value="Inventory">Inventory</option>
              <option value="Transports">Transports</option>
            </select>
          </div>
  
          <!-- Department Name Dropdown (Conditional) -->
          <div v-if="organization === 'Department'" class="user-input-box">
            <label for="departmentName" class="label-wrapper">
              <span>Department Name</span>
            </label>
            <select id="departmentName" name="departmentName" class="styled-select" required v-model="departmentName">
              <option value="" disabled selected>Select Department Name</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
  
          <div class="user-input-box">
            <label for="role" class="label-wrapper">
              <img src="@/assets/form/role.png" alt="Role Icon" class="label-icon" >
              <span>Role</span>
            </label>
            <select id="role" name="role" class="styled-select" required v-model="role">
              <option value="" disabled selected>Select Role</option>
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
        </div>
        <div class="form-submit-btn">
          <button type="submit">Register</button>
        </div>
      </form>
       <!-- Add the custom popup -->
      
    </div>
    <div v-if="showPopup" class="custom-popup">
      <p>{{ successMessage }}</p>
      <button @click="closePopup">Close</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
    return {
      username: '',
      email: '',
      idNumber: '',
      phoneNumber: '',
      organization: '',
      role: '',
      departmentName:'',
      roleOptions: [
        { value: 'Head', label: 'Head' },
        { value: 'Member', label: 'Member' }
      ], // Initial role options
      successMessage: '',
      showPopup: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            idNumber: this.idNumber,
            phoneNumber: this.phoneNumber,
            organization: this.organization,
            role: this.role,
            departmentName: this.departmentName,
          }),
        });
        if (response.ok) {
          this.showSuccessPopup('Registration successful!');
        } else {
          console.error('Registration failed:', response.statusText);
          // Handle failure, e.g., show an error message
        }
      } catch (error) {
        console.error('Error submitting registration:', error);
        // Handle error, e.g., show an error message
      }
    },
    async checkEmailExists() {
      try {
        const response = await fetch("http://localhost:3000/checkEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
          }),
        });
        const data = await response.json();
        if (data.exists) {
          console.log("Email exists in the database");
          // Redirect to dashboard
                } else {
          console.log("Email does not exist in the database");
          // Continue with regular flow
        }
      } catch (error) {
        console.error("Error checking email:", error);
        // Handle error, e.g., show an error message
      }
    },

    handleOrganizationChange() {
      // Adjust role options based on selected organization
      if (this.organization === 'Inventory') {
        this.roleOptions = [{ value: 'Manager', label: 'Manager' }];
        this.role = 'Manager'; // Set role to Manager automatically
      } else {
        this.roleOptions = [
          { value: 'Head', label: 'Head' },
          { value: 'Member', label: 'Member' }
        ];
        this.role = ''; // Reset role selection
      }
    },
    showSuccessPopup(message) {
      this.successMessage = message;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      window.location.reload();
    },
  },
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */

  .custom-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background-color: #333;
    text-align: center;
    box-shadow:  4px 4px 6px 0 rgba(92, 89, 89, 0.3),
              -4px -4px 6px 0 rgb(63, 64, 64), 
    inset -4px -4px 6px 0 rgba(41, 40, 40, 0.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    border-radius: 30px;
    padding: 10px 20px;
  }
  
  .custom-popup p {
    color: #0f0;
    font-size: 20px;
    font-weight: bold;
  }
  
  .custom-popup button {
    background-color: #919191;
    color: #000;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  }
  
  .custom-popup button:hover {
    background-color: #373636;
    color: #fff;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px; /* Adjust as needed */
  }
  
  .header-container h2 {
    text-align: center;
    margin: 0; /* Remove default margin */
    flex: 1; /* Allow h2 to take remaining space */
  }
  
  .header-container button.close-button {
    background-color: rgb(178, 50, 50);
    color: #fff;
    border: none;
    border-radius: 50%; /* Make it circular */
    width: 20px; /* Set a fixed width for the circle */
    height: 20px; /* Set a fixed height for the circle */
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .header-container button.close-button i {
    font-size: 15px;
  }

  .header-container button.close-button:hover{
    background-color: red;
    color: #000;
  }


  .form-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Ensures the form is centered vertically */
    margin: 0 1in; /* 1-inch margin on all sides */
    margin: 0;
    padding: 0;
    background:  #e3e3e2;
  }

  .form-title {
    font-size: 24px; /* Adjusted font size for the form title */
    font-weight: 600;
    text-align: center;
    padding-bottom: 6px;
    color: #111827;
    text-shadow: 2px 2px 2px  #989897;
    border-bottom: 3px solid rgba(4, 35, 16, 0.416);
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
  }

  .main-user-info {
    padding: 15px 0; /* Reduced padding for user info section */
  }

  .user-input-box {
    margin-bottom: 10px; /* Reduced margin between input boxes */
    width: 400px;
  }

  .user-input-box label {
    color: #111827;
    font-size: 16px; /* Reduced font size for labels */
    font-weight: 600;
    margin: 5px 0;
    font-family: 'Poppins', sans-serif;
  }

  .user-input-box .label-wrapper {
    display: flex;
  }

  .user-input-box .label-icon {
    width: 20px;
    margin-right: 10px;
    align-self: center; /* Align the icon vertically */
  }

  .user-input-box input,
  .user-input-box select.styled-select {
    height: 40px; /* Maintained input height */
    width: 100%; /* Full width for input fields */
    border-radius: 5px; /* Adjusted border-radius */
    outline: none;
    border: 1px solid rgb(8, 8, 8);
    padding: 0 5px; /* Reduced padding for inputs */
    background: transparent;
    -webkit-text-fill-color: #000000;
    -webkit-text-stroke-color: #030303;
    color: #000000; /* Text color for consistency */
  }

  .form-submit-btn {
    margin-top: 30px; /* Reduced margin for submit button */
  }

  .form-submit-btn button {
    display: block;
    width: 100%;
    font-size: 18px; /* Adjusted font size for submit button */
    padding: 10px; /* Reduced padding for submit button */
    border: none;
    border-radius: 10px 10px 10px;
    color: #111827;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    background: #b8b6b4;
    cursor: pointer; /* Change cursor on hover */
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    border-radius: 30px;
    padding: 10px 20px;
  }

  .form-submit-btn button:hover {
    background-color: #7f7e7d;
    color: rgb(255, 255, 255);
  }

  /* Hover and focus styles for dropdown menus */
  .user-input-box select.styled-select:hover,
  .user-input-box select.styled-select:focus {
    background-color: #949392; /* Match background color on hover/focus */
    color:black;
  }

  .popup {
    background-color: rgb(248, 241, 241);
    padding: 20px;
    box-shadow:  4px 4px 6px 0 rgba(57, 57, 57, 0.3),
              -4px -4px 6px 0 rgba(62, 62, 62, 0.2), 
    inset -4px -4px 6px 0 rgba(0, 0, 0, 0.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    padding: 10px 20px;
  }
  
  .popup form {
    margin-bottom: 10px;
  }
  
  .popup button {
    margin-right: 10px;
  }
  </style>
  