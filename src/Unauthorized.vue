<template>
  <div class="wrapper">
    <h1 class="title">Oops! Unauthorized Access</h1>
    <div class="image-container">
      <div class="img-circle"></div>
    </div>
    <div class="text-container">
      <div class="text">
        <p>It seems you've stumbled upon a restricted area. How did you end up here?</p>
        <p>Maybe you were looking for something else? 😄</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedPage',
};
</script>

<style scoped>


.title {
  font-size: 24px;
  font-weight: 600;
  padding-bottom: 6px;
  color: #111827;
  border-bottom: 3px solid rgba(4, 35, 16, 0.416);
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
}

.image-container {
  width: 300px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  background-image: url('@/assets/unauthorized.png');
  background-size: cover;
  height: 300px;
}

.text-container {
  font-size: 1.2rem;
  color: black;
}

.link {
  color: blue;
  text-decoration: none;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}
.wrapper {
  width: 420px;
  border: 3px solid rgba(15, 20, 17, 0.416);
  border-radius: 12px;
  padding: 30px 40px;
  background: #f3f0ec;
  justify-content: center; /* horizontal centering */
  align-items: center; /* vertical centering */
  position: absolute; /* positioning to center */
  top: 50%; /* position from top */
  left: 50%; /* position from left */
  transform: translate(-50%, -50%); /* move the element back by 50% of its own width and height */
}
body {
  background: #f3f0ec;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.wrapper {
  width: 420px;
  border: 3px solid rgba(15, 20, 17, 0.416);
  border-radius: 12px;
  padding: 30px 40px;
  background: #f3f0ec;
  margin: auto; /* Center the wrapper horizontally */
  text-align: center; /* Center text inside wrapper */
}

</style>
