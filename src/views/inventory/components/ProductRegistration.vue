<template>
    <div  v-if="!showPopup" class="popup">
      <div class="header-container">
        <h2>{{ isEditing ? 'Edit Product' : 'New Product' }}</h2>
        <button class="close-button" @click="closePopup">
          <i class="fas fa-times"></i> <!-- Font Awesome close icon -->
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="main-product-info">
          <div class="product-input-box">
            <label for="productId" class="label-wrapper">
              <i class="fas fa-id-card-alt icon"></i>
              <span>Product ID</span>
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              placeholder="Enter Product ID"
              v-model="productId"
              required
            />
          </div>
          <div class="product-input-box">
            <label for="productName" class="label-wrapper">
              <i class="fas fa-tag icon"></i>
              <span>Product Name</span>
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              placeholder="Enter Product Name"
              v-model="productName"
              required
            />
          </div>
          <div class="product-input-box">
            <label for="company" class="label-wrapper">
              <i class="fas fa-building icon"></i>
              <span>Company</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Enter Company"
              v-model="company"
              required
            />
          </div>
          <div class="product-input-box">
            <label for="description" class="label-wrapper">
              <i class="fas fa-file-alt icon"></i>
              <span>Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Description (Minimum 50 words)"
              v-model="description"
              required
              minlength="50"
              rows="4" 
            ></textarea>
          </div>
          <div class="product-input-box">
            <label for="quantity" class="label-wrapper">
              <i class="fas fa-boxes icon"></i>
              <span>Quantity</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter Quantity"
              v-model="quantity"
              required
            />
          </div>
          <!-- New label for Product Image Upload -->
          <div class="product-input-box">
            <label for="productImage" class="label-wrapper">
              <i class="fas fa-image icon"></i>
              <span>Product Image</span>
            </label>
            <div class="image-preview-container">
              <img v-if="imageUrl" :src="imageUrl" alt="Product Image" class="image-preview" />
              <span v-else>No image uploaded</span>
            </div>
            <!-- Custom file input styling -->
            <label for="file-upload" class="custom-file-label">
              Upload Image
            </label>
            <input
              type="file"
              id="file-upload"
              class="custom-file-input"
              name="productImage"
              accept="image/*"
              @change="handleImageUpload"
              required
            />
          </div>
        </div>
        <div class="form-submit-btn">
          <button type="submit">{{ isEditing ? 'Update Product' : 'Add New Product' }}</button>
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
    name: "ProductRegistration",
    props: {
      isEditing: Boolean,
      editingProductId: String,
    },
    data() {
      return {
        productId: '',
        productName: '',
        company: '',
        description: '',
        quantity: '',
        productImage: null,
        successMessage: '',
        showPopup: false,
        imageUrl: '',
      };
    },
    methods: {
      async fetchProductData(productId) {
      try {
        const response = await fetch(`http://localhost:3000/oldproductdata/${productId}`);
        const productData = await response.json(); // Parse response as JSON directly

        this.productId = productData.productId;
        this.productName = productData.productName;
        this.company = productData.company;
        this.description = productData.description;
        this.quantity = productData.quantity;
        // Assuming imageUrl is stored on the server as well
        this.imageUrl = `http://localhost:3000/products/images/${productId}`;
      } catch (error) {
        console.error('Error fetching product data:', error);
        // Handle error, such as showing a notification to the user
      }
    },
    async handleSubmit() {
      try {
        const formData = new FormData();
        formData.append('productId', this.productId);
        formData.append('productName', this.productName);
        formData.append('company', this.company);
        formData.append('description', this.description);
        formData.append('quantity', this.quantity);
        formData.append('productImage', this.productImage);
        let url = 'http://localhost:3000/products';
        let method = 'POST'; // Default to POST for new product

        if (this.isEditing) {
          url += `/${this.productId}`;
          method = 'PUT'; // Use PUT for updating existing product
        }

        const response = await fetch(url, {
          method,
          body: formData,
        });

        if (response.ok) {
          // Update success message or handle success action
          this.showSuccessPopup(this.isEditing ? 'Product updated successfully!' : 'Product added successfully!');
          // Optionally update component data if needed
          this.productId = ''; // Reset form fields
          this.productName = '';
          this.company = '';
          this.description = '';
          this.quantity = '';
          this.imageUrl = '';
        } else {
          const errorData = await response.json();
          console.error('Failed to save product:', errorData.message);
          // Handle error, such as showing an error notification
        }
      } catch (error) {
        console.error('Error saving product:', error);
        // Handle network errors or other exceptions
      }
    },

      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.imageUrl = URL.createObjectURL(file);
          this.productImage = file;
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
    created() {
      if (this.isEditing) {
        this.fetchProductData(this.editingProductId);
      }
    },
  };
</script>

  
  <style scoped>
  /* Add your component-specific styles here */


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

  .custom-file-input {
    display: none;
    box-shadow:  4px 4px 6px 0 rgba(57, 57, 57, 0.3),
              -4px -4px 6px 0 rgba(62, 62, 62, 0.2), 
    inset -4px -4px 6px 0 rgba(0, 0, 0, 0.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    padding: 10px 20px;
    border: #000 2px solid;
  }

  .main-product-info {
    padding: 15px 0; /* Reduced padding for product info section */
  }

  .product-input-box {
    margin-bottom: 10px; /* Reduced margin between input boxes */
    width: 400px;
  }

  .product-input-box label {
    color: #111827;
    font-size: 16px; /* Reduced font size for labels */
    font-weight: 600;
    margin: 5px 0;
    font-family: 'Poppins', sans-serif;
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

  .product-input-box textarea{
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
  .product-input-box select.styled-select:hover,
  .product-input-box select.styled-select:focus {
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
    max-height: 90vh; /* Adjust maximum height as needed */
    overflow-y: auto;
  }

  .popup::-webkit-scrollbar {
    width: 10px;               /* width of the entire scrollbar */
  }

  .popup::-webkit-scrollbar-track {
    background: #fff;        /* color of the tracking area */
  }

  .popup::-webkit-scrollbar-thumb {
    background-color: #000000;    /* color of the scroll thumb */
    border-radius: 20px;       /* roundness of the scroll thumb */
    border: 3px solid rgb(255, 255, 255);  /* creates padding around scroll thumb */
  }
  
  .popup form {
    margin-bottom: 10px;
  }
  
  .popup button {
    margin-right: 10px;
  }
  </style>
  