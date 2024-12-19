<template>
  <header class="header-main">
    <h2>
      <label for="nav-toggle">
        <span class="las la-bars" style="font-size: 2rem"></span>
      </label>
      {{ title }}
    </h2>
    <div class="user-wrapper">
      <img
        :src="userProfile.profilePhoto"
        class="img-inventory"
        width="40px"
        height="40px"
        alt="Profile Photo"
      />
      <div class="user-info">
        <h4>{{ userName }}</h4>
        <small>{{ userRole }}</small>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderMain",
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    title: {
      // New prop for custom title
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.img-inventory {
  width: 40px;
  height: 40px; /* Adjust height as needed */
  margin-right: 10px; /* Add spacing between image and text */
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style-type: none;
  text-decoration: none;
}

.slidebar {
  width: 345px;
  position: fixed;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  transition: width 300ms;
}

.slidebar-brand {
  height: 90px;
  padding-left: 1rem 0rem 1rem 2rem;
  color: #000000;
  align-content: center;
}

.slidebar-brand span {
  display: inline-block;
  padding-right: 1rem;
}

.slidebar-brand h2 {
  font-family: "Kalam", sans-serif; /* Use Kalam font */
  font-weight: 700; /* Bold weight */
  display: flex;
  font-size: 30px;
  align-items: center;
}

.sliderbar-menu {
  margin-top: 1rem;
}

.sliderbar-menu li {
  width: 100%;
  margin-bottom: 1.7rem;
  padding-left: 1rem;
}

.sliderbar-menu a {
  padding-left: 1rem;
  display: block;
  color: #f5f5f5;
  font-size: 1.1rem;
}

.sliderbar-menu a span:first-child {
  font-size: 1.5rem;
  padding-right: 1rem;
}

.sliderbar-menu a.active {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background: rgb(58, 58, 58);
  border-radius: 30px 0px 0px 30px;
}

#nav-toggle:checked + .slidebar {
  width: 70px;
}

#nav-toggle:checked + .slidebar .slidebar-brand,
#nav-toggle:checked + .slidebar li {
  padding-left: 1rem;
}

#nav-toggle:checked + .slidebar li a {
  padding-left: 0rem;
}

#nav-toggle:checked + .slidebar .slidebar-brand h2 span:last-child,
#nav-toggle:checked + .slidebar li a span:last-child {
  display: none;
}

#nav-toggle:checked ~ .main-content {
  margin-left: 70px;
}

#nav-toggle:checked ~ .main-content header {
  width: calc(100% - 70px); /* Corrected */
  left: 70px;
}
.main-content {
  transition: margin-left 300ms;
  margin-left: 345px;
}

header {
  display: flex;
  padding: 1rem 1.5rem;
  justify-content: space-between;
  position: fixed;
  left: 345px;
  width: calc(100% - 345px);
  top: 0;
  z-index: 100;
  transition: left 300ms;
  background: #838282;
}

#nav-toggle {
  display: none;
}

header h2 {
  color: #222;
}

header label span {
  font-size: 1rem;
  padding-right: 1rem;
}

.search-wrapper {
  border: 1px solid #ccc;
  border-radius: 30px;
  height: 50px;
  display: flex;
  align-items: center;
  overflow-x: hidden;
}

.search-wrapper span {
  display: inline-block;
  padding: 0rem 1rem;
  font-size: 1.5rem;
}

.search-wrapper input {
  height: 100%;
  padding: 0.5rem;
  border: none;
  outline: none;
}

.user-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-wrapper img {
  border-radius: 50%;
  margin-right: 0.5rem;
}

.user-wrapper small {
  display: inline-block;
  color: rgb(249, 0, 0);
  margin-top: -1px !important;
}

.user-info {
  font-family: "Philosopher", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.user-info small {
  font-size: 17.5px;
}

main {
  margin-top: 90px;
  padding: 2px 1.5rem;
  min-height: calc(100vh - 90px);
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2rem;
  margin-top: 1rem;
}

.card-single {
  display: flex;
  justify-content: space-between;
  background-color: #c8c8c8d9;
  padding: 2rem;
  border-radius: 2px;
}

.card-single div:last-child span {
  font-size: 3rem;
  color: #838282;
}

.card-single div:first-child span {
  color: #011151;
}

.card-single:last-child {
  background: #838282;
}
.card-single:last-child h1,
.card-single:last-child div:first-child span,
.card-single:last-child div:first-child {
  color: #fff;
}

.recent-grid {
  margin-top: 3.5rem;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 65% auto;
}

.card {
  background: #c8c8c8d9;
  border-radius: 5px;
}

.card-header,
.card-body {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: #f0f0f0;
}

.card-header button {
  background: #838282;
  border-radius: 10px;
  color: white;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border: 1px solid #838282;
}

/* task */

.task-container {
  background-color: #c8c8c8d9;
  border-radius: 5px;
}
.task-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-left: 8px;
  margin-right: 8px;
}

.todo-list {
  display: flex;
  justify-content: space-between; /* Space items evenly */
  align-items: center; /* Align items vertically */
  width: 100%; /* Ensure full width */
}
.add-input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 50px;
  font-size: 16px;
  outline: none; /* Remove default focus outline */
  transition: border-color 0.3s ease; /* Smooth transition for border color */
  cursor: pointer; /* Custom cursor */
}

/* Style for the input box when focused */
.add-input:focus {
  border-color: #007bff; /* Change border color on focus */
}

.add-button {
  width: 20%; /* Set button width to 20% */
  margin-left: 10px; /* Add margin as needed */
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 8px;
}

.plus-icon {
  font-size: 1.5rem;
  border-radius: 50%;
  background-color: #28a745;
  color: #fff;
  padding: 0.5rem;
}

/* Light green hover state */
.plus-icon:hover {
  background-color: #188a33;
}

/* Dark green hover state */
.plus-icon:hover:active {
  background-color: #218838;
}
.remove-btn {
  font-size: 1.5rem;
  border-radius: 50%;
  background-color: #dc3545;
  color: #fff;
  padding: 0.5rem;
  margin-left: 10px;
  cursor: pointer;
}

/* Light red hover state */
.remove-btn:hover {
  background-color: #ff6b6b;
}

/* Dark red hover state */
.remove-btn:hover:active {
  background-color: #c82333;
}

.task-table {
  width: 100%; /* Ensure the table takes full width */
  margin-top: 2%;
}

.task-table th {
  padding: 8px; /* Adjust padding as needed */
  text-align: left; /* Align text to the left */
}

.task-table td.task-name-cell {
  width: 80%; /* Set 80% width for task name cells */
  padding: 8px; /* Adjust padding as needed */
}
.task-table td.action-cell {
  width: 20%; /* Set 20% width for action cells */
  text-align: center; /* Center align content in action cells */
}

/* */

table {
  border-collapse: collapse;
}

thead tr {
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
}

thead td {
  font-weight: 700;
}

td {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #222;
}

td .status {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 1rem;
}

tr td:last-child {
  display: flex;
  align-items: center;
}

.status.purple {
  background: rebeccapurple;
}

.status.pink {
  background: deeppink;
}
.status.orange {
  background: orangered;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.customer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.7rem;
}
.info {
  display: flex;
  align-items: center;
}
.info img {
  border-radius: 50%;
  margin-right: 1rem;
}

.info h4 {
  font-size: 0.8rem;
  font-weight: 700;
  color: #222;
}

.info small {
  font-weight: 600;
  color: rgb(255, 0, 0);
}

.contact span {
  font-size: 1.2rem;
  display: inline-block;
  margin-left: 0.5rem;
  color: #838282;
}

@media only screen and (max-width: 1200px) {
  .slidebar {
    width: 70px;
  }

  .slidebar .slidebar-brand,
  .slidebar li {
    padding-left: 1rem;
  }

  .slidebar li a {
    padding-left: 0rem;
  }

  .slidebar .slidebar-brand h2 span:last-child,
  .slidebar li a span:last-child {
    display: none;
  }

  .main-content {
    margin-left: 70px;
  }

  .main-content header {
    width: calc(100% - 70px); /* Corrected */
    left: 70px;
  }

  .slidebar:hover {
    width: 345px;
    z-index: 200;
  }

  .slidebar:hover .slidebar-brand,
  .slidebar:hover li {
    padding-left: 2rem;
    text-align: center;
  }

  .slidebar:hover li a {
    padding-left: 1rem;
  }

  .slidebar:hover .slidebar-brand h2 span:last-child,
  .slidebar:hover li a span:last-child {
    display: inline;
  }
}

@media only screen and (max-width: 960px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .recent-grid {
    grid-template-columns: 60% 40%;
  }
}

@media only screen and (max-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .recent-grid {
    grid-template-columns: 100%;
  }

  .search-wrapper {
    display: none;
  }

  .slidebar {
    left: -100% !important;
  }

  header h2 {
    display: flex;
    align-items: center;
  }

  header h2 label {
    display: inline-block;
    background: #838282;
    padding-right: 0rem;
    margin-right: 1rem;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center !important;
  }

  header h2 span {
    text-align: center;
    padding-right: 0rem;
  }

  header h2 {
    font-size: 1.1rem;
  }

  .main-content {
    width: 100%;
    margin-left: 0rem;
  }

  header {
    width: 100% !important;
    left: 0 !important;
  }

  #nav-toggle:checked + .slidebar {
    left: 0 !important;
    z-index: 100;
    width: 345px;
  }

  #nav-toggle:checked + .slidebar .slidebar-brand,
  #nav-toggle:checked + .slidebar li {
    padding-left: 2rem;
    text-align: left;
  }

  #nav-toggle:checked + .slidebar li a {
    padding-left: 1rem;
  }

  #nav-toggle:checked + .slidebar .slidebar-brand h2 span:last-child,
  #nav-toggle:checked + .slidebar li a span:last-child {
    display: inline;
  }

  #nav-toggle:checked ~ .main-content {
    margin-left: 0rem !important;
  }

  #nav-toggle:checked + .slidebar h2 {
    display: none;
  }
  #nav-toggle:checked + .slidebar .sliderbar-menu {
    justify-content: space-between;
    align-items: center;
    margin-left: 10;
  }
}

@media only screen and (max-width: 560px) {
  .cards {
    grid-template-columns: 100%;
  }
  #nav-toggle:checked + .slidebar {
    left: 0 !important;
    z-index: 100;
    width: 150px;
  }

  #nav-toggle:checked + .slidebar li {
    padding-left: 2rem;
    text-align: left;
  }

  #nav-toggle:checked + .slidebar li a {
    padding-left: 1rem;
    font-size: 12px;
  }
}
</style>
