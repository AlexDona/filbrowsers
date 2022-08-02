<template>
    <div class="ranks container">
        <div class="ranking mt-1.8 mb-3">
           <rankPower :showPagination="true" :currentSelect="$route.params"  :showMore="false" page="all"></rankPower>
        </div>
    </div>
</template>
<script>
import rankPower from "@/views/components/rankPower"

export default {
  components: {
    rankPower
  },
  data () {
    return {                       }
  },
  methods: {},
  mounted () {
  }
}
</script>
<style scoped lang="scss">
.ranks {
    //margin-bottom: 1rem;
}
</style>
