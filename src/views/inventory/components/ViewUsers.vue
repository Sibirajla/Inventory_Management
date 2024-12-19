<template>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
  
    <body>
        <input type="checkbox" id="nav-toggle">
      <SidebarMain /> <!-- Include the Sidebar component here -->
      <div class="main-content">
        <HeaderMain :userProfile="userProfile" :userName="userName" :userRole="userRole" title="Users" />
        <main> 
          <div class="table-responsive">
            <div class="container">
                <div class="search-bar-user">
                  <div class="search-container">
                    <input type="text" name="search" v-model="searchKeyword"  placeholder="Search..." class="search-input">
                    <a href="#" class="search-btn">
                            <i class="fas fa-search"></i>      
                    </a>
                  </div>
                  <button class="btn" @click="openPopup">Add User</button>
                </div>
                <div class="table-container">
                  <table class="table">
                    <thead>
                      <tr>
                        <th><i class="fas fa-key"></i> ID Number</th>
                        <th><i class="fas fa-user"></i> User Name</th>
                        <th><i class="fas fa-envelope"></i> Email</th>
                        <th><i class="fas fa-building"></i> Organization</th>
                        <th><i class="fas fa-shield-alt"></i> Role</th>
                        <th><i class="fas fa-cogs"></i> Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(user, index) in filteredUsers" :key="index">
                        <td>{{ user.idNumber }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.organization }}</td>
                        <td>{{ user.role }}</td>
                        <td>
                          <button @click="removeUser(user._id)" class="remove-btn">
                            <i class="fas fa-trash-alt"></i> 
                          </button>
                        </td>
                      </tr>
                    </tbody>  
                  </table>
                </div>
              </div>
          </div>
           <!-- Popup for user registration -->
        </main>
  
      </div>
    </body>
  
     <!-- Popup for user registration -->
     <!-- Popup for user registration -->
    <div class="popup-overlay" v-if="showPopup">
      <user-registration-form @close="closePopup" />
    </div>

    </html>
  </template>
  
  <script>
  import SidebarMain from '@/views/inventory/components/Sidebar.vue';
  import HeaderMain from '@/views/inventory/components/HeaderMain.vue';
  import UserRegistrationForm from '@/views/inventory/components/UserRegistrationForm.vue';
  export default {
    name: "ViewUsers",
    components: {
      SidebarMain,
      HeaderMain,
      UserRegistrationForm 
  },
    data() {
      return {
        userProfile: {
          profilePhoto: "https://i.pinimg.com/736x/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.jpg"
        },
        userName: "",
        userRole: "",
        title:"",
        users: [],
        showPopup: false,
      newUser: {
        username: '',
        email: ''
      },
      searchKeyword: '',
      };
    },
    mounted() {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (userData && userData.email) {
        this.email = userData.email; // Set email if available
  
        fetch('http://localhost:3000/getUserInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: userData.email })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const { username, role } = data;
          this.userName = username;
          this.userRole = role;
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
      } else {
        console.error('User data not found in sessionStorage');
      }
  
      // Update profile photo if available in sessionStorage
      if (userData && userData.profilePhoto) {
        this.userProfile.profilePhoto = userData.profilePhoto;
      }

      this.fetchUserData();
    },
    computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.idNumber.toString().includes(this.searchKeyword.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        user.organization.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
    methods: {

      async fetchUserData() {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (userData && userData.email) {
          const response = await fetch('http://localhost:3000/registrations', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'user-email': userData.email // Pass logged-in user's email
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          this.users = data; // Update users array with fetched data
        } else {
          console.error('User data not found in sessionStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

      openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    async removeUser(userId) {
      try {
        const response = await fetch(`http://localhost:3000/removeUser/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Assuming the response message indicates successful deletion
        const message = await response.text();
        console.log(message); // Log the response message
        // Update the users array after successful removal
        this.users = this.users.filter(user => user._id !== userId);
      } catch (error) {
        console.error('Error removing user:', error);
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
    font-family: 'Poppins', sans-serif;
  }

  .main-content {
    margin-top: 60px;
    padding: 2px 1.5rem;
    min-height: calc(100vh - 60px); 
    background: #e3e3e2;
    border-radius: 5px;
    margin-left: 345px;
    transition: margin-left 300ms;
    width:-100%; /* Adjust to match your sidebar width */
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
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
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
    align-items:center;
    justify-content:center;
  }


  .table-container {
    max-height: 600px; /* Set a maximum height for scroll */
    overflow-y: auto; /* Enable vertical scrolling */
  }

  table {
    border-collapse: collapse;
    border-spacing: 0 10px;
    width: 100%;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
    border-radius: 8px; /* Rounded corners for aesthetics */
    text-align: center;
  }
  
  /* Apply styles to table header cells */

  .table thead{
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    border-radius: 30px;
    padding: 10px 20px;
  }
  .table thead th {
    color:#fff;
    position: sticky;
    top: 0;
    background: #000000; /* Light gray background */
    z-index: 1; /* Ensure header stays above content */
    
  }

  .search-bar-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-bar-user input{
    width: 20% ;
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
    color: rgb(0, 0, 0)  ;
      box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
              -4px -4px 6px 0 rgba(116, 125, 136, .2), 
    inset -4px -4px 6px 0 rgba(255,255,255,.2),
    inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    border-radius: 30px;
    padding: 10px 20px;
    }

    .btn:hover{
      background: linear-gradient(to bottom, rgb(102, 102, 102), rgb(102, 102, 102));
      font-weight: bolder;
      color: #fff;
    }


  #nav-toggle:checked ~ .main-content{
    margin-left: 70px;
    }

    .table-container::-webkit-scrollbar {
      width: 10px;               /* width of the entire scrollbar */
    }
  
    .table-container::-webkit-scrollbar-track {
      background: #fff;        /* color of the tracking area */
    }
  
    .table-container::-webkit-scrollbar-thumb {
      background-color: #000000;    /* color of the scroll thumb */
      border-radius: 20px;       /* roundness of the scroll thumb */
      border: 3px solid rgb(255, 255, 255);  /* creates padding around scroll thumb */
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


  
.search-container{
  background: #c7c4c4;
  height: 45px;
  border-radius: 30px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.8s;
  /*box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
  inset -7px -7px 10px 0px rgba(0,0,0,.1),
 7px 7px 20px 0px rgba(0,0,0,.1),
 4px 4px 5px 0px rgba(0,0,0,.1);
 text-shadow:  0px 0px 6px rgba(255,255,255,.3),
            -4px -4px 6px rgba(116, 125, 136, .2);
text-shadow: 2px 2px 3px rgba(255,255,255,0.5);*/
box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
            -4px -4px 6px 0 rgba(116, 125, 136, .2), 
  inset -4px -4px 6px 0 rgba(255,255,255,.2),
  inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
}

.search-container:hover > .search-input{
  width: 270px;
}

.search-container .search-input{
  background: transparent;
  border: none;
  outline:none;
  width: 0px;
  font-weight: 500;
  font-size: 16px;
  transition: 0.8s;

}

.search-container .search-btn .fas{
  color: #5cbdbb;
}

@keyframes hoverShake {
0% {transform: skew(0deg,0deg);}
25% {transform: skew(5deg, 5deg);}
75% {transform: skew(-5deg, -5deg);}
100% {transform: skew(0deg,0deg);}
}

.search-container:hover{
animation: hoverShake 0.15s linear 3;
}


@media only screen and (max-width: 1200px) {
 .main-content{
    margin-left: 70px;
  }
  
  .main-content header {
    width: calc(100% - 70px); /* Corrected */
    left: 70px;
  }
}

@media only screen and (max-width: 768px){
  .main-content{
    width: 100%;
    margin-left: 0rem;
  }

  #nav-toggle:checked ~ .main-content {
    margin-left: 0rem !important;
  
  }
}

  /* Hide scrollbar for the entire component */
  </style>
  