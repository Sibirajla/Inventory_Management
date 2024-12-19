<template>
  <div v-if="!showPopup" class="popup">
    <div class="header-container">
      <h2>Request Product</h2>
      <button class="close-button" @click="closePopup">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="product-input-box">
        <!-- Existing Product Name Field -->
        <label for="productName" class="label-wrapper">
          <i class="fas fa-tag icon mr-1"></i>
          <span>Product Name</span>
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          placeholder="Enter Product Name"
          v-model="productName"
          @input="getProductSuggestions"
        />
        <button type="button" class="manual-btn" @click="addManualProduct">
          <i class="fas fa-tools"></i> Manual
        </button>
        <ul v-if="showSuggestions" class="suggestions-list">
          <!-- Suggestions List -->
          <li
            v-for="product in suggestedProducts"
            :key="product._id"
            @click="addProduct(product)"
          >
            <div>
              <span
                ><strong><i class="fas fa-bookmark icon mr-1"></i>Name:</strong>
                {{ product.productName }}</span
              >
              <span
                ><strong><i class="fas fa-key icon mr-1"></i>ID:</strong>
                {{ product.productId }}</span
              >
            </div>
          </li>
        </ul>
      </div>

      <!-- Selected Products Section -->
      <div class="selected-products-box">
        <div
          v-for="(product, index) in selectedProducts"
          :key="product._id"
          class="selected-product-item"
        >
          {{ product.productName }}
          <button type="button" @click="removeProduct(index)">
            <i class="fas fa-times cross-icon"></i>
          </button>
        </div>
      </div>

      <!-- Reason Field -->
      <div class="product-input-box">
        <label for="reason" class="label-wrapper">
          <i class="fas fa-comment mr-1"></i>
          <span>Reason</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          v-model="reason"
          placeholder="Enter Reason"
          rows="4"
          required
        ></textarea>
      </div>

      <!-- Quantity Field -->
      <div class="product-input-box">
        <label for="quantity" class="label-wrapper">
          <i class="fas fa-sort-numeric-up mr-1"></i>
          <span>Quantity</span>
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          v-model.number="quantity"
          placeholder="Enter Quantity"
          required
        />
      </div>

      <!-- Budget Field -->
      <div class="product-input-box">
        <label for="budget" class="label-wrapper">
          <i class="fas fa-money-bill-alt mr-1"></i>
          <span>Budget</span>
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          v-model.number="budget"
          placeholder="Enter Budget"
          required
        />
      </div>

      <!-- Submit Button -->
      <div class="form-submit-btn">
        <button type="submit"><i class="fas fa-plus-circle"></i> Add Request</button>
      </div>
    </form>
  </div>
  <div v-if="showPopup" class="custom-popup">
    <p>{{ successMessage }}</p>
    <button @click="closePopup">Close</button>
  </div>
</template>

<script>
export default {
  name: "ProductRequest",
  props: {
    isEditing: Boolean,
    editingProductId: String,
  },
  data() {
    return {
      productName: "",
      suggestedProducts: [],
      showSuggestions: false,
      selectedProducts: [],
      successMessage: "",
      showPopup: false,
      imageUrl: "",
      showMore: {}, // Object to track show more/less state for descriptions
      reason: "",
      quantity: 0,
      budget: 0,
      email: "", // Initialize email field
      department: "", // Initialize department field
      userOrganization: "",
    };
  },
  async mounted() {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (userData && userData.email) {
        const response = await fetch("http://localhost:3000/getUserInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email }),
        });
        const data = await response.json();
        const { username, role, organization, departmentName } = data;
        this.email = userData.email;
        this.userName = username;
        this.userRole = role;
        this.userOrganization = organization; // Save organization to component data
        this.department = departmentName; // Save department to component data

        // Now fetch products based on department
        await this.fetchProducts();
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  },
  methods: {
    async getProductSuggestions() {
      if (this.productName.trim() === "") {
        this.showSuggestions = false;
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/fetchProducts?productName=${this.productName}`
        );
        const data = await response.json();
        this.suggestedProducts = data;
        this.showSuggestions = true;
      } catch (error) {
        console.error("Error fetching product suggestions:", error);
      }
    },
    addProduct(product) {
      this.selectedProducts.push(product);
      this.productName = "";
      this.showSuggestions = false;
    },
    addManualProduct() {
      if (this.productName.trim() === "") {
        alert("Please enter a valid product name.");
        return;
      }
      const newProduct = {
        _id: Math.random().toString(36).substr(2, 9),
        productName: this.productName.trim(),
        // Add other properties as needed
      };
      this.selectedProducts.push(newProduct);
      this.productName = "";
      this.showSuggestions = false;
    },

    async handleSubmit() {
      try {
        const formData = {
          productName: this.selectedProducts
            .map((product) => product.productName)
            .join(", "),
          reason: this.reason,
          quantity: this.quantity,
          budget: this.budget,
          status: 0,
          email: this.email, // Use email from data
          department: this.department, // Use department from data
          organization: this.userOrganization,
        };

        // Send formData to backend API
        const response = await fetch("http://localhost:3000/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          this.showSuccessPopup("Request submitted successfully!");
          this.productName = "";
          this.reason = "";
          this.quantity = 0;
          this.budget = 0;
          this.selectedProducts = [];
        } else {
          throw new Error("Failed to submit request");
        }
      } catch (error) {
        console.error("Error submitting request:", error);
        alert("Error submitting request. Please try again.");
      }
    },

    removeProduct(index) {
      this.selectedProducts.splice(index, 1);
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

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
}

.selected-products-box {
  margin-top: 10px;
}

.selected-product-item {
  display: inline-block;
  margin-right: 10px;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
}

.image-preview-container {
  position: relative;
  margin-bottom: 10px;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  margin-top: 5px;
}

.custom-file-input {
  display: none;
}

.custom-file-label {
  display: inline-block;
  background-color: #3498db;
  color: #fff;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-file-label:hover {
  background-color: #2980b9;
}

.custom-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: #333;
  text-align: center;
  box-shadow: 4px 4px 6px 0 rgba(92, 89, 89, 0.3), -4px -4px 6px 0 rgb(63, 64, 64),
    inset -4px -4px 6px 0 rgba(41, 40, 40, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
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
  font-weight: 900;
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

.header-container button.close-button:hover {
  background-color: red;
  color: #000;
}

.form-wrapper {
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ensures the form is centered vertically */
  margin: 0 1in; /* 1-inch margin on all sides */
  margin: 0;
  padding: 0;
  background: #e3e3e2;
}

.form-title {
  font-size: 24px; /* Adjusted font size for the form title */
  font-weight: 600;
  text-align: center;
  padding-bottom: 6px;
  color: #111827;
  text-shadow: 2px 2px 2px #989897;
  border-bottom: 3px solid rgba(4, 35, 16, 0.416);
  font-family: "Roboto", sans-serif;
  font-weight: bold;
}

.custom-file-input {
  display: none;
  box-shadow: 4px 4px 6px 0 rgba(57, 57, 57, 0.3), -4px -4px 6px 0 rgba(62, 62, 62, 0.2),
    inset -4px -4px 6px 0 rgba(0, 0, 0, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  border: #000 2px solid;
}

.main-product-info {
  padding: 15px 0; /* Reduced padding for product info section */
}

.product-input-box {
  margin-bottom: 10px; /* Reduced margin between input boxes */
  min-width: 500px;
}

.product-input-box label {
  color: #111827;
  font-size: 16px; /* Reduced font size for labels */
  font-weight: 600;
  margin: 5px 0;
  font-family: "Poppins", sans-serif;
}

.product-input-box .label-wrapper {
  display: flex;
}

.product-input-box .label-icon {
  width: 20px;
  margin-right: 10px;
  align-self: center; /* Align the icon vertically */
}

.product-input-box input,
.product-input-box select.styled-select {
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

.product-input-box textarea {
  height: 100px; /* Maintained input height */
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
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  background: #b8b6b4;
  cursor: pointer; /* Change cursor on hover */
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
}

.form-submit-btn button:hover {
  background-color: #7f7e7d;
  color: rgb(255, 255, 255);
}

/* Hover and focus styles for dropdown menus */
.product-input-box select.styled-select:hover,
.product-input-box select.styled-select:focus {
  background-color: #949392; /* Match background color on hover/focus */
  color: black;
}

.popup {
  width: 50%;
  background-color: rgb(248, 241, 241);
  padding: 20px;
  box-shadow: 4px 4px 6px 0 rgba(57, 57, 57, 0.3), -4px -4px 6px 0 rgba(62, 62, 62, 0.2),
    inset -4px -4px 6px 0 rgba(0, 0, 0, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  max-height: 90vh; /* Adjust maximum height as needed */
  overflow-y: auto;
}

.popup::-webkit-scrollbar {
  width: 10px; /* width of the entire scrollbar */
}

.popup::-webkit-scrollbar-track {
  background: #fff; /* color of the tracking area */
}

.popup::-webkit-scrollbar-thumb {
  background-color: #000000; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid rgb(255, 255, 255); /* creates padding around scroll thumb */
}

.popup form {
  margin-bottom: 10px;
}

.popup button {
  margin-right: 10px;
}

.product-input-box {
  margin-bottom: 20px;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 5px 0;
}

.suggestions-list li {
  padding: 10px 10px;
  color: #000000;
  border: 1px solid #000000;
  margin-bottom: 5px;
  cursor: pointer;
  font-size: 12px;
  background-color: #e9e8e8;
}

.suggestions-list li:hover {
  background-color: #484848;
  color: #fff;
}

.suggestions-list li div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suggestions-list button {
  border: none;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 5px;
}

.selected-product-item {
  font-size: 14px;
  background: #bdbcbc28;
  color: #000;
  border-radius: 8px; /* Adjust the value for desired roundness */
  border: 2px solid rgb(96, 92, 92);
  font-weight: 700;
  padding: 10px; /* Adjust padding as needed */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow */
}
.cross-icon {
  color: red; /* Customize icon color */
  cursor: pointer; /* Show pointer cursor on hover */
}

.manual-btn {
  margin-top: 10px;
  color: #000;
  width: fit-content;
  background: #0f0;
  border-radius: 20px 20px;
  padding: 5px;
  font-size: 12px;
  font-weight: 500;
}
</style>
