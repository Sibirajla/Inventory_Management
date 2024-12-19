<template>
  <body>
    <input type="checkbox" id="nav-toggle" />
    <SidebarMain />
    <!-- Include the Sidebar component here -->
    <div class="main-content">
      <HeaderMain
        :userProfile="userProfile"
        :userName="userName"
        :userRole="userRole"
        title="Buy Products"
      />
      <main>
         <!-- Edit Popup Component -->
         <EditPopup
          :product="selectedProduct"
          :reqNo="selectedReqNo"
          @update-product-success="updateProductSuccess"
          v-if="showPopup"
          @close="closeEditPopup"
        />
        <!-- Alert Component -->
        
        <div class="custom-alert" v-if="showAlert">
          <div class="alert-content">
            <p>Product Updated</p>
            <button @click="closeAlert">Close</button>
          </div>
        </div>

        <div class="table-responsive">
          <div class="container">
            <div class="request-container">
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
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th><i class="fas fa-list-ol mr-1"></i> Req No</th>
                    <th><i class="fas fa-tag mr-1"></i> Product Name</th>
                    <th><i class="fas fa-sort-amount-up mr-1"></i> Quantity</th>
                    <th><i class="fas fa-info-circle mr-1"></i> Product Description</th>
                    <th><i class="fas fa-link mr-1"></i> Link</th>
                    <th><i class="fas fa-check-circle mr-1"></i> Status</th>
                  </tr>
                </thead>
                <tbody v-if="filteredProducts.length > 0">
                  <template
                    v-for="(request, reqIndex) in filteredProducts"
                    :key="reqIndex"
                  >
                    <tr
                      v-for="(product, prodIndex) in request.products"
                      :key="product._id"
                    >
                      <td
                        v-if="prodIndex === 0"
                        :rowspan="request.products.length"
                        class="req-email"
                      >
                        <div>{{ request.reqNo }}</div>
                      </td>
                      <td>{{ product.productName }}</td>
                      <td>{{ product.quantityNeeded }}</td>
                      <td>{{ product.description }}</td>
                      <td>
                        <a v-if="isLinkValid" :href="formatLink(product.link)" target="_blank" rel="noopener noreferrer">
                          <i class="fas fa-external-link-alt mr-1"></i>
                        </a>
                        <i v-else class="fas fa-external-link-alt mr-1 text-muted"></i>
                      </td>
                      <td>
                        <template v-if="product.status === 0">
                          <button class="edit" @click="openEditPopup(product, request.reqNo)">Edit</button>
                        </template>
                        <template v-else>
                          <span class="status green"></span>Link updated
                        </template>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="7">No data available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>



<script>
import SidebarMain from "@/views/member/components/Sidebar.vue";
import HeaderMain from "@/views/member/components/HeaderMain.vue";
import EditPopup from "@/views/member/components/EditPopup.vue";

export default {
  name: "Buy_Product_Member",
  components: {
    SidebarMain,
    HeaderMain,
    EditPopup,
  },
  data() {
    return {
      userProfile: {
        profilePhoto: "https://i.pinimg.com/736x/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.jpg",
      },
      userName: "",
      userRole: "",
      requests: [],
      searchKeyword: "",
      showPopup: false,
      selectedProduct: null,
      showAlert: false,
      alertMessage: "",
    };
  },
  methods: {
    openEditPopup(product, reqNo) {
      this.selectedProduct = product;
      this.selectedReqNo = reqNo;
      this.showPopup = true;
    },
    closeEditPopup() {
      this.showPopup = false;
    },
    updateProductSuccess() {
      this.showAlert = true; // Show custom alert
      setTimeout(() => {
        this.showAlert = false; // Hide alert after some time
      }, 3000); // Adjust duration as needed
    },
    closeAlert() {
      this.showAlert = false;
    },
    formatLink(link) {
      if (!link) {
        return '#'; // or any default URL or error handling
      }
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return 'https://' + link;
      }
      return link;
    },
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/getbuyproduct");
        const data = await response.json();

        // Get the stored user data from session storage
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const userEmail = userData ? userData.email : null;

        // Filter the data based on the email
        this.requests = data.filter(item => item.email === userEmail);
        
        // Process the filtered data
        this.filterData();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    filterData() {
      this.filteredProducts = this.requests.map((item) => ({
        reqNo: item.reqNo,
        email: item.email,
        products: item.products,
      }));
    },

  },
  computed: {
    filteredProducts() {
      if (!this.searchKeyword.trim()) {
        return this.requests;
      }
      const keyword = this.searchKeyword.toLowerCase().trim();
      const userFilteredProducts = this.requests.filter((request) => {
        return request.email === this.userData.email;
      });
      return userFilteredProducts.filter((request) => {
        const idString = request.reqno ? request.reqno.toString() : "";
        const name = request.productName ? request.productName.toLowerCase() : "";
        const transferredQuantity = request.transferredQuantity
          ? request.transferredQuantity.toString()
          : "";
        const status = request.status ? request.status.toString() : "";
        return (
          idString.includes(keyword) ||
          name.includes(keyword) ||
          transferredQuantity.includes(keyword) ||
          status.includes(keyword)
        );
      });
    },
  },
  isLinkValid() {
      return this.product.link && this.product.link.length > 0;
    },
  async mounted() {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (userData && userData.email) {
        const response = await fetch("http://localhost:3000/getUserInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email }),
        });
        const data = await response.json();
        const { username, role } = data;
        this.userName = username;
        this.userRole = role;
        await this.fetchProducts();
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
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

.custom-popup {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.custom-feedback-modal {
  width: 40%;
  max-width: 300px; /* Adjust as needed */
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}
td {
  width: fit-content;
}
.custom-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.custom-header-title {
  margin: 0;
}

.custom-close-button {
  background-color: green;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
}

.custom-close-icon {
  font-size: 16px;
}

.custom-feedback-textarea {
  width: 100%;
  height: 100px;
  resize: none;
  margin-bottom: 10px;
}

.custom-send-button {
  display: block;
  margin: 0 auto;
  background-color: green;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.custom-send-button:hover {
  cursor: pointer;
  opacity: 0.8;
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

.close-button {
  align-items: center;
}
.send-msg {
  background-color: #70ee2c; /* Light red background */
  color: #333; /* Dark text color */
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.3),
    -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
    inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2), inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 10px 20px;
}

.feedback-modal {
  text-align: center;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.close-button {
  color: red; /* Red color for the button */
  background-color: transparent;
  border: none;
  cursor: pointer;
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
  text-align: center;
  top: 0;
  background: #000000; /* Light gray background */
  z-index: 1; /* Ensure header stays above content */
}

th,
td {
  padding: 12px; /* Increased padding for better spacing */
  text-align: center;
  border-bottom: 1px solid #ddd;
  white-space: nowrap; /* Prevent text wrapping in table cells */
  overflow: hidden;
  text-overflow: ellipsis; /* Show ellipsis for overflowing text */
  vertical-align: middle; /* Center align content vertically */
}

/* Center Req No and Email cells */
td.req-email {
  width: 1%;
  white-space: nowrap;
}

td.req-email > div {
  display: inline-block;
  vertical-align: middle;
}

/* Set specific width for columns */
.description-column {
  width: 40%;
  max-width: 150px; /* Adjust max-width as needed */
  text-align: left;
}

.search-bar-request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar-request input {
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

.request-container {
  background: #c7c4c4;
  height: 45px;
  width: fit-content;
  margin-bottom: 20px;
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

.request-container:hover > .search-input {
  width: 270px;
}

.request-container .search-input {
  background: transparent;
  border: none;
  outline: none;
  width: 0px;
  font-weight: 500;
  font-size: 16px;
  transition: 0.8s;
}

.request-container .search-btn .fas {
  color: #5cbdbb;
}

.rupee-icon {
  font-size: 1.2em; /* Adjust size as needed */
  color: #07a904; /* Example color */
  margin-right: 2px;
}

.reject-btn {
  background: red;
  color: #000000;
  border-radius: 20px 20px;
  padding: 10px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 2px 2px 2px rgb(45, 43, 43);
}

.approve-btn {
  background: rgb(75, 243, 75);
  color: #000000;
  border-radius: 20px 20px;
  padding: 10px;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 2px 2px 2px rgb(45, 43, 43);
}

.req-class {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.status.yellow {
  background: yellow;
}
.status.red {
  background: red;
}

.status.green {
  background: green;
}

td .status {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 1rem;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* Center modal vertically and horizontally */
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
  max-width: 80%; /* Limit maximum width of the modal */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* Feedback Modal Specific Styles */
.feedback-modal {
  max-width: 300px; /* Adjust the maximum width of the modal content */
}

/* Style the textarea */
#feedback {
  width: 100%;
  height: 100px; /* Adjust the initial height as needed */
  resize: vertical; /* Allow vertical resizing */
}

/* Style the send button */
.send-btn {
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-btn:hover {
  background-color: #45a049;
}


.custom-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #cccccc;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
  font-family: 'Segoe UI', Arial, sans-serif; /* Fancy font family */
}

.alert-content {
  text-align: center;
  color: #000000;
  font-size: 20px; /* Increased font size */
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  background-color: #e0e0e0; /* Very light gray background */
  color: #333; /* Dark text color */
  cursor: pointer;
  font-family: 'Segoe UI', Arial, sans-serif; /* Fancy font family */
  transition: background-color 0.3s ease; /* Smooth hover effect */
}

button:hover {
  background-color: #4aeb35; /* Slightly darker gray on hover */
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

.request-container:hover {
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
