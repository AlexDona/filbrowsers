<template>
    <div class="p-404 container">
        <div class="main text-center">
            <img class="img_404" src="../assets/img/404.png" alt="">
            <div>
                <el-button size="medium" type="primary" round @click="goPage('home')">Back to home page</el-button>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  methods: {
    goPage(name) {
      this.$router.push({name})
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang="scss">
.main {
    margin: 0 auto;
    padding: 30px;
}
.img_404 {
    margin-bottom: 2rem;
    width: 300px;
    height: 300px;
}
</style>
