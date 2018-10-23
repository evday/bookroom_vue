<template>
    <div class="ownitem">

    <el-badge :value="item.num">
        <span  class="el-icon-circle-plus-outline" @click="addNum()"></span>
        <el-button size="small">{{item.name}}</el-button>
        <span class="el-icon-remove-outline" @click="remove()"></span>
    </el-badge>
    </div>
</template>

<script>

export default {
    props:{
        item:{
            type:Object,
            required: true
        }
    },
    methods:{
        addNum:function(e){
          this.item.num++
          
        },
        remove:function(){
          this.item.num--
          if (this.item.num <= 0){
            this.item.num = 0
        }
        }, 
    }

}
</script>


<style scoped>

</style>