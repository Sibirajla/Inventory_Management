
<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <div class="popup-header">Edit Product Details</div>
      <div class="popup-body">
        <div class="form-group">
          <label for="productName" class="form-label">Product Name:</label>
          <input type="text" id="productName" v-model="editedProduct.productName" class="form-input" readonly/>
        </div>
        
        <div class="form-group">
          <label for="link" class="form-label">Link:</label>
          <input type="text" id="link" v-model="editedProduct.link" class="form-input" />
        </div>
        
        <div class="form-group description-group">
          <label for="description" class="form-label">Description (50 words max):</label>
          <div class="description-container">
            <textarea id="description" v-model="editedProduct.description" class="form-textarea"></textarea>
          </div>
        </div>
      </div>
      <div class="popup-footer">
        <button class="cancel-btn" @click="closePopup">Cancel</button>
        <button class="submit-btn" @click="saveChanges">Save</button>
      </div>
    </div>

    <!-- Custom alert for product updated -->
  </div>
</template>


<script>
export default {
  props: {
    product: Object,
    reqNo: String,
  },
  data() {
    return {
      editedProduct: { ...this.product }
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    saveChanges() {
      if (!this.reqNo || !this.product) {
        console.error('Invalid product data');
        return;
      }

      const url = `http://localhost:3000/buyupdateproduct/${this.reqNo}/${this.editedProduct.productName}`;
      const data = {
        link: this.editedProduct.link,
        description: this.editedProduct.description,
      };

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Product updated:', data);
        this.$emit('update-product-success'); // Emit success event
        this.closePopup();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
    },
  },
};
</script>




<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-group label{
  font-weight: 600;
}

.popup-content {
  background-color: #fff;
  padding: 30px; /* Increased padding */
  border-radius: 16px; /* Increased border radius */
  width: 480px; /* Adjusted width */
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2); /* Increased box shadow */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Change font family */
}

.popup-header {
  font-size: 28px; /* Increased font size */
  font-weight: bold;
  margin-bottom: 20px;
  color: #333; /* Text color */
}

.popup-body {
  margin-bottom: 30px;
}

.popup-footer {
  text-align: right;
}

.popup-footer button {
  margin-left: 10px;
  padding: 12px 24px; /* Increased padding */
  border-radius: 10px; /* Increased border radius */
  font-size: 18px; /* Increased font size */
  cursor: pointer;
}

.cancel-btn {
  background-color: #FF6347; /* Coral color */
  color: #fff;
  border: none;
}

.submit-btn {
  background-color: #32CD32; /* Lime Green color */
  color: #fff;
  border: none;
}

.form-group {
  margin-bottom: 20px; /* Increased margin */
  display: flex;
  align-items: center;
}

.form-label {
  width: 160px; /* Adjusted label width */
  font-size: 18px;
  color: #555;
  margin-right: 20px;
}

.form-input,
.form-textarea {
  font-size: 16px;
  padding: 10px;
  border-radius: 8px;
}

.form-textarea {
  height: 180px; /* Adjusted textarea height */
  width: 100%; /* Full width */
}

/* Hover styles */
.cancel-btn:hover,
.submit-btn:hover {
  opacity: 0.8;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); /* Increased box shadow */
}

</style>
