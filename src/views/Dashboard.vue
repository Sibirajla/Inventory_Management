<template>
  <!DOCTYPE html>
<!-- Created By CodingNepal -->
  <html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <div class="center">
          <div class="ring"></div>
          <span>loading...</span>
        </div>
    </body>
  </html>
</template>

<script>
export default {
  name: 'DashboardView',
  async mounted() {
    await this.delay(2000);
    await this.getUserRole();
  },
  methods: {
    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async getUserRole() {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const email = userData.email;

        const response = await fetch('http://localhost:3000/getUserRole', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();

        if (response.ok) {
          const { role } = data;
          this.redirectBasedOnRole(role); // Redirect based on the fetched role
        } else {
          this.$router.push({ name: 'UnauthorizedPage' });
        }
      } catch (error) {
        this.$router.push({ name: 'UnauthorizedPage' });
      }
    },
    redirectBasedOnRole(role) {
      if (role === 'Head') {
        this.$router.push({ name: 'DashboardHead' });
      } else if (role === 'Member') {
        this.$router.push({ name: 'DashboardMember' });
      }else if (role === 'Manager') {
        this.$router.push({ name: 'DashboardInventory' });
      } 
      else {
        // Handle other roles or default behavior
        this.$router.push({ name: 'UnauthorizedPage' });
        // Redirect to default page or handle appropriately
      }
    },
  },
};
</script>

<style scoped>
  body{
    margin: 0;
    padding: 0;
    font-family: montserrat;
    background: #e3e3e2;
  }
  .center{
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  .ring{
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    animation: ring 2s linear infinite;
  }
  @keyframes ring {
    0%{
      transform: rotate(0deg);
      box-shadow: 1px 5px 2px #e65c00;
    }
    50%{
      transform: rotate(180deg);
      box-shadow: 1px 5px 2px #18b201;
    }
    100%{
      transform: rotate(360deg);
      box-shadow: 1px 5px 2px #0456c8;
    }
  }
  .ring:before{
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255,255,255,.3);
  }
  span{
    color: #737373;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    line-height: 200px;
    animation: text 3s ease-in-out infinite;
  }
  @keyframes text {
    50%{
      color: black;
    }
  }
</style>
