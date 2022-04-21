<template>
  <div id="app">
    <wallet/>
  </div>
</template>

<script>
import wallet from './components/wallet'

export default {
  name: 'App',
  components: {
    wallet
  }
}
</script>

<style>
#app{
  height: 100%;
  width: 100%;
}
</style>
