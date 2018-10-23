
<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="el-icon-menu"></i>
                </div>

            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    
                    <span class="el-dropdown-link"><i class="el-icon-setting">&nbsp;&nbsp;{{userInfo.username}}&nbsp;&nbsp;</i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside>
                <el-menu background-color="#eef1f6"
                        text-color="#48576a"
                        active-text-color="#409EFF"
                        :default-active="$route.path"  
                        unique-opened 
                        router>
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :key="index+''" v-if="!item.leaf" index="" v-show="ishow()">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden"><i :class="child.iconCls"></i> {{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :key="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
						<el-menu-item v-show="!ishow()" index="" :key="item.children[1].path"><i :class="item.iconCls"></i>{{item.children[1].name}}</el-menu-item>
					</template>   
                </el-menu>
            </aside>

            <section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>

        </el-col>
    </el-row>
</template>

<script>
    export default {
        data() {
            return {
                sysName:"会议室预定",
                collapsed:false,
                userInfo:this.$store.state.userInfo
               
            }
        },
        methods:{
            //退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					type: 'warning'
				}).then(() => {
					window.localStorage.removeItem('user');
                    location.reload();
                    routes.push({
                        path: '/'
                    });
				}).catch(() => {
				});
            },
            ishow:function(){
                if (this.userInfo.isadmin){
                    return true
                }else {
                    return false
                    this.collapsed = true
                }
            }
        }
    }

</script>

<style scoped>	

.el-menu {
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #eef1f6;
    height: 100%;
}

.container{
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

}
.header{
    height: 60px;
    line-height: 60px;
    background: #409EFF;
    color: #fff;
}
.userinfo{
    text-align: right;
    padding-right: 35px;
    float: right;
    cursor: pointer;
}
.logo{
    height: 60px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
}
.tools{
    padding: 0px 23px;
    width: 14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    font-size: 1.5em;
}
.logo-width{
    width:230px;
}
.logo-collapse-width{
    width:60px
}
span .el-icon-setting{
    font-size: 1.5em;
    color: #fff;
}
aside {
    flex: 0 0 230px;
    width: 230px;
}
.main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
}
.content-container {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
}
.title {
    width: 200px;
    float: left;
    color: #475669;
}
.breadcrumb-inner {
    float: right;
}
.content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
}
</style>