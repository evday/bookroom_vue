<template>
  <div >
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
 
}
</script>



<style>

body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
  /* background: #1F2D3D; */
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

.toolbar {
 background: #f2f2f2;
 margin-top: 20px;
/* margin: 10px 0; */
 }
.toolbar .el-form {
    margin-top: 10px;
    margin-bottom: -12px;
    margin-left: 11px;
}
</style>
