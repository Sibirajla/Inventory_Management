<template>
  <body class=" h-screen">
    <div class="flex justify-center items-center min-h-screen">
      <div class="wrapper  text-gray-800"> <!-- Updated wrapper background and text color -->
        <form>
          <h1 class="title text-3xl mb-8 font-bold">BIT INVENTORY</h1> <!-- Updated title text color -->
          <img src="@/assets/logo.png" alt="Logo"><br>
          <div @click="handleSignIn" type="button" class="input-box bg-sandy button-hover hover:text-white hover:shadow-lg font-bold py-2 px-4 rounded-full flex items-center justify-center transition duration-300 ease-in-out">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" class="ml-2 h-6 w-6"> <!-- Google logo -->
            <span class="mr-3"></span>
            Sign in with Google
          </div>                     
        </form>
      </div>
    </div>

   <!-- Custom modal for sign-in failure -->
   <div v-if="showSignInFailed" class="custom-modal">
    <div class="modal-content">
      <p class="warning-msg">Sign-in failed. Please try again.</p>
      <div class="battery-container" v-if="countdownTime > 0">
        <div class="battery-level" :style="{ width: batteryWidth }"></div>
      </div>
    </div>
  </div>

  </body>
</template>
<script>
export default {
  data() {
    return {
      showSignInFailed: false,
      countdownTime: 5,
      countdownInterval: null,
      batteryWidth: '100%',
    };
  },
  created() {
    const isUserSignedIn = sessionStorage.getItem('isUserSignedIn');
    if (isUserSignedIn) {
      this.$router.push({ name: 'DashboardView' });
    }
  },
  methods: {
    async handleSignIn() {
      const isUserSignedIn = sessionStorage.getItem('isUserSignedIn');
      if (isUserSignedIn) {
        this.$router.push({ name: 'DashboardView' });
        return; // Exit the method early if the user is already signed in
      }

      try {
        
        const googleUser = await this.$gAuth.signIn();
        if (!googleUser) {
          this.showSignInFailed = true;
          this.startCountdown();
          return null;
        }

        const profile = googleUser.getBasicProfile();
        sessionStorage.setItem('userData', JSON.stringify({ 
          username: profile.getName(), 
          email: profile.getEmail(),
          profilePhoto: profile.getImageUrl(),
        }));
        sessionStorage.setItem('isUserSignedIn', true); // Assuming sign-in is successful

        const emailCheckResponse = await fetch('http://localhost:3000/checkEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: profile.getEmail(),
          }),
        });

        if (!emailCheckResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const emailCheckResult = await emailCheckResponse.json();

        if (emailCheckResult.exists) {
          // Email exists in database, redirect to dashboard
          this.$router.push('/dashboard');
        } else {
          // Email does not exist, redirect to onboarding
          this.$router.push({ name: 'UnauthorizedPage' });
        }
      } catch (error) {
        console.error(error);
        this.showSignInFailed = true;
        this.resetCountdown();
        this.startCountdown();
      }
    },
    closeSignInFailedPopup() {
      this.showSignInFailed = false;
      this.resetCountdown();
      clearInterval(this.countdownInterval);
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.countdownTime--;
        this.updateBatteryLevel();
        if (this.countdownTime <= 0) {
          clearInterval(this.countdownInterval);
          this.showSignInFailed = false;
        }
      }, 1000);
    },
    updateBatteryLevel() {
      const remainingPercentage = (this.countdownTime / 5) * 100;
      this.batteryWidth = `${remainingPercentage}%`;
    },
    resetCountdown() {
      this.countdownTime = 5;
      this.batteryWidth = '100%';
    },
  },
};
</script>



<style scoped>
/* Tailwind CSS classes used in place of previous CSS */
.wrapper {
  width: 420px;
  border: 3px solid rgb(0, 0, 0);
  border-radius: 12px;
  padding: 30px 40px;
  background: #ffffff;
}

.btn {
  height: 45px;
  font-size: 16px;
  font-weight: 600;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 2px #125a05;
}

/* Styles for the custom modal */
.custom-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 5px;
  right: 0;
  width: fit-content;
  height: 10%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  z-index: 999;
}

.modal-content {
  background-color: #cd2727;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-msg {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
  color: #ffffff; /* Tomato red text color */
}

.battery-container {
  width: 100%;
  height: 10px;
  background-color: #f0f0f0; /* Light gray background */
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
}

.battery-level {
  height: 100%;
  background-color: #4caf50; /* Green battery level */
  transition: width 0.5s ease-in-out;
}



body {
  background: #ffffff;
}

.bg-sandy {
  background-color: lightgreen; /* Set the button background color to sandy */
  color: #333; /* Set the button text color to a suitable dark color */
}

.button-hover:hover {
  background-color: green; /* Lighten the button background color on hover */
}

.hover\:text-white:hover {
  color: #fff !important; /* Change text color to white on hover */
}
/* Custom styles for gradient background */

</style>


