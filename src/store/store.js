import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { getAllRoom } from '../api/api'

export default new Vuex.Store({
    state:{
        allRoom:[],
        userInfo:{}
    },
    mutations:{
        getAllRoom:function(){
            getAllRoom().then((res) =>{
                for(var i=0;i<res.data.data.length;i++){
                    var obj = new Object()
                    obj['value'] =  res.data.data[i].id
                    obj['label'] = res.data.data[i].roomname
                    this.state.allRoom.push(obj) 
                }
            })
        },

        //获取当前登录用户
        getuser:function(){
            let userData = JSON.parse(window.localStorage.getItem('user'));
            this.state.userInfo = Object.assign({}, userData);
        },
    }
})