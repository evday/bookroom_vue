<template>
    <div class="item">

    <el-badge :value="value">
        <span  class="el-icon-circle-plus-outline" @click="addNum()"></span>
        <el-button size="small">{{item.equipname}}</el-button>
        <span class="el-icon-remove-outline" @click="remove()"></span>
    </el-badge>
    </div>
</template>

<script>

export default {
    data(){
        return{
         
        }
    },
    props:{
        item:{
            type: Object,
            required: true
        },
        value:{
            type: String,
            required: true
        }
    },
    methods:{
        addNum:function(e){
          this.value++
          
        },
        remove:function(){
          this.value--
          if (this.value <= 0){
            this.value = 0
        }
        }, 
    }

}
</script>


<style scoped>

</style>


