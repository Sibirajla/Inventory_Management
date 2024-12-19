<template>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
    </head>

    <body>
      <input type="checkbox" id="nav-toggle" />
      <SidebarMain />
      <!-- Include the Sidebar component here -->
      <div class="main-content">
        <HeaderMain
          :userProfile="userProfile"
          :userName="userName"
          :userRole="userRole"
          title="Product Lists"
        />
        <main>
          <div class="table-responsive">
            <div class="container">
              <div class="search-bar-product">
                <div class="product-container">
                  <input
                    type="text"
                    name="search"
                    v-model="searchKeyword"
                    placeholder="Search..."
                    class="search-input"
                  />
                  <a href="#" class="search-btn">
                    <i class="fas fa-search"></i>
                  </a>
                </div>
                <div class="button-container">
                  <button class="btn" @click="openPopup">
                    <span class="las fa-box" style="margin-right: 10px"></span>Add Product
                  </button>
                  <button class="export-btn" @click="exportData">
                    <i class="fas fa-file-excel mr-1"></i>Export
                  </button>
                </div>
              </div>
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th><i class="fas fa-id-badge mr-1"></i> Product ID</th>
                      <th><i class="fas fa-tag mr-1"></i> Product Name</th>
                      <th><i class="fas fa-image mr-1"></i> Product Image</th>
                      <th><i class="fas fa-building mr-1"></i> Company</th>
                      <th class="description-column">
                        <i class="fas fa-file-alt mr-1"></i> Description
                      </th>
                      <th><i class="fas fa-sort-amount-up mr-1"></i> Quantity</th>
                      <th><i class="fas fa-cogs mr-1"></i> Action</th>
                    </tr>
                  </thead>
                  <tbody v-if="filteredProducts.length > 0">
                    <tr v-for="(product, index) in filteredProducts" :key="index">
                      <td style="color: rgb(61, 61, 190)">{{ product.productId }}</td>
                      <td>{{ product.productName }}</td>
                      <td>
                        <img
                          :src="getProductImageUrl(product.productId)"
                          :alt="product.productName"
                          style="max-width: 100px"
                        />
                      </td>
                      <td>{{ product.company }}</td>
                      <td class="description-column">
                        <div v-if="product.description.length > 70">
                          <div v-if="!product.showFullDescription">
                            {{ product.description.slice(0, 70) }}...
                            <span @click="toggleDescription(index)">
                              <div style="color: blueviolet">Read more</div>
                            </span>
                          </div>
                          <div v-else>
                            {{ product.description }}
                            <span @click="toggleDescription(index)">
                              <div style="color: blueviolet">Show less</div>
                            </span>
                          </div>
                        </div>
                        <div v-else>
                          {{ product.description }}
                        </div>
                      </td>
                      <td>{{ product.quantity }}</td>
                      <td>
                        <button class="edit" @click="openEditForm(product.productId)">
                          <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="7" style="text-align: center">No data available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </body>

    <!-- Popup for user registration -->
    <div class="popup-overlay" v-if="showPopup">
      <ProductRegisteration
        :isEditing="isEditing"
        :editingProductId="editingProductId"
        @close="closePopup"
      />
    </div>
  </html>
</template>

<script>
import { utils, writeFile } from "xlsx";
import SidebarMain from "@/views/inventory/components/Sidebar.vue";
import HeaderMain from "@/views/inventory/components/HeaderMain.vue";
import ProductRegisteration from "@/views/inventory/components/ProductRegistration.vue";
export default {
  name: "Product_list",
  components: {
    SidebarMain,
    HeaderMain,
    ProductRegisteration,
  },
  data() {
    return {
      userProfile: {
        profilePhoto:
          "https://i.pinimg.com/736x/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.jpg",
      },
      userName: "",
      userRole: "",
      title: "Product Lists",
      products: [],
      showPopup: false,
      searchKeyword: "",
      editingProductId: null, // Track the ID of the product being edited
      isEditing: false, // Flag to indicate edit mode
    };
  },
  async mounted() {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData && userData.email) {
      this.email = userData.email; // Set email if available

      fetch("http://localhost:3000/getUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.email }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const { username, role } = data;
          this.userName = username;
          this.userRole = role;
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    } else {
      console.error("User data not found in sessionStorage");
    }

    // Update profile photo if available in sessionStorage
    if (userData && userData.profilePhoto) {
      this.userProfile.profilePhoto = userData.profilePhoto;
    }

    this.fetchProducts();
  },
  computed: {
    filteredProducts() {
      return this.products.filter(
        (product) =>
          product.productId
            .toString()
            .toLowerCase()
            .includes(this.searchKeyword.toLowerCase()) ||
          product.productName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          product.company.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },

  methods: {
    openEditForm(productId) {
      this.editingProductId = productId;
      this.isEditing = true;
      this.showPopup = true; // Show the popup with the registration form
    },
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        this.products = data.map((product) => {
          return product;
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    getProductImageUrl(productId) {
      return `http://localhost:3000/products/images/${productId}`;
    },
    toggleDescription(index) {
      // Use native JavaScript assignment to set the property
      this.filteredProducts[index].showFullDescription = !this.filteredProducts[index]
        .showFullDescription;
    },

    exportData() {
      if (this.products.length > 0) {
        const dataToExport = this.products.map((product) => {
          const { productId, productName, company, description, quantity } = product;
          const imageUrl = this.getProductImageUrl(product.productId); // Get image URL
          return { productId, productName, company, description, quantity, imageUrl };
        });

        const worksheet = utils.json_to_sheet(dataToExport);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Product Data");
        writeFile(workbook, "product_data.xlsx");
      } else {
        console.error("No data available to export.");
      }
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style-type: none;
  text-decoration: none;
}

body {
  font-family: "Poppins", sans-serif;
}

.main-content {
  margin-top: 60px;
  padding: 2px 1.5rem;
  min-height: calc(100vh - 60px);
  background: #e3e3e2;
  border-radius: 5px;
  margin-left: 345px;
  transition: margin-left 300ms;
  width: -100%; /* Adjust to match your sidebar width */
  font-family: "Poppins", sans-serif;
}

.remove-btn {
  background-color: #fddb00; /* Light red background */
  color: #333; /* Dark text color */
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  font-size: 12px;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
}

.remove-btn:hover {
  background-color: #cc0000; /* Dark red background on hover */
  color: #fff; /* White text color on hover */
}

.remove-btn i {
  margin-right: 5px; /* Add some spacing between icon and text */
}

.table-responsive {
  overflow-x: auto;
  padding: 1rem 1.5rem;
  align-items: center;
  justify-content: center;
}

.edit {
  background-color: #fddb00; /* Light red background */
  color: #333; /* Dark text color */
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  font-size: 12px;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
}

.edit:hover {
  background-color: #cc0000; /* Dark red background on hover */
  color: #fff; /* White text color on hover */
}
.table-container {
  max-height: 600px; /* Set a maximum height for scroll */
  overflow-y: auto; /* Enable vertical scrolling */
}

.table {
  border-collapse: collapse;
  border-spacing: 0 10px;
  text-align: center;
  width: 100%;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
  border-radius: 8px; /* Rounded corners for aesthetics */
}

/* Apply styles to table header cells */
.table thead {
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
}

.table thead th {
  color: #fff;
  position: sticky;
  top: 0;
  background: #000000; /* Light gray background */
  z-index: 1; /* Ensure header stays above content */
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  white-space: normal; /* Allow text wrapping */
  overflow: hidden; /* Hide overflow text */
}

/* Set specific width for columns */
.description-column {
  width: 40%;
  max-width: 150px; /* Adjust max-width as needed */
  text-align: left;
}

.search-bar-product {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar-product input {
  width: 20%;
  border-radius: 20px;
  background-color: rgb(187, 184, 184);
  height: 40px;
  text-align: center;
  color: #000000;
  -webkit-text-fill-color: #000000;
}

tr td {
  padding: 23px 0; /* Adjust as needed */
}
.btn {
  width: fit-content;
  height: fit-content;
  font-size: 16px;
  font-weight: bolder;
  background: linear-gradient(to bottom, rgb(177, 178, 177), rgb(205, 205, 202));
  color: rgb(0, 0, 0);
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
}

.btn:hover {
  background: linear-gradient(to bottom, rgb(102, 102, 102), rgb(102, 102, 102));
  font-weight: bolder;
  color: #fff;
}

.export-btn {
  width: fit-content;
  height: fit-content;
  font-size: 16px;
  font-weight: bolder;
  background: linear-gradient(to bottom, rgb(51, 187, 60), rgb(36, 106, 47));
  color: rgb(0, 0, 0);
  border-radius: 30px;
  padding: 10px 20px;
}

.export-btn:hover {
  background: linear-gradient(to bottom, rgb(0, 80, 14), rgb(0, 78, 8));
  font-weight: bolder;
  color: #fff;
}

#nav-toggle:checked ~ .main-content {
  margin-left: 70px;
}

.table-container::-webkit-scrollbar {
  width: 10px; /* width of the entire scrollbar */
}

.table-container::-webkit-scrollbar-track {
  background: #fff; /* color of the tracking area */
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #000000; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid rgb(255, 255, 255); /* creates padding around scroll thumb */
}

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* ensure it appears above other content */
}

.product-container {
  background: #c7c4c4;
  height: 45px;
  border-radius: 30px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.8s;
  text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
}

.product-container:hover > .search-input {
  width: 270px;
}

.product-container .search-input {
  background: transparent;
  border: none;
  outline: none;
  width: 0px;
  font-weight: 500;
  font-size: 16px;
  transition: 0.8s;
}

.product-container .search-btn .fas {
  color: #5cbdbb;
}

.button-container {
  display: flex;
  gap: 10px; /* Adjust spacing between buttons */
}

.import-btn {
  /* Style the Import button as needed */
}

@keyframes hoverShake {
  0% {
    transform: skew(0deg, 0deg);
  }
  25% {
    transform: skew(5deg, 5deg);
  }
  75% {
    transform: skew(-5deg, -5deg);
  }
  100% {
    transform: skew(0deg, 0deg);
  }
}

.product-container:hover {
  animation: hoverShake 0.15s linear 3;
}

@media only screen and (max-width: 1200px) {
  .main-content {
    margin-left: 70px;
  }

  .main-content header {
    width: calc(100% - 70px); /* Corrected */
    left: 70px;
  }
}

@media only screen and (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0rem;
  }

  #nav-toggle:checked ~ .main-content {
    margin-left: 0rem !important;
  }
}

/* Hide scrollbar for the entire component */
</style>
