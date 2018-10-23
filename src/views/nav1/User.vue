<template>

    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.username" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

        <el-table :data="users" highlight-current-row  style="width: 100%;">
			<el-table-column type="selection" width="60">
			</el-table-column>

            <el-table-column prop="id" label="ID" width="140" sortable>
			</el-table-column>
			<el-table-column prop="username" label="姓名" width="140" sortable>
			</el-table-column>
			<el-table-column prop="isadmin" label="是否是管理员" min-width="150" sortable>
			</el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="150" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>



        <!--新增界面-->
        <el-dialog title="新增用户" :visible.sync="addFormVisible">
            
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="addForm.username" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="addForm.repassword" autocomplete="off" type="password"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-checkbox v-model="addForm.isadmin">是否是管理员</el-checkbox>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="handleAdd">取 消</el-button>
                <el-button type="primary" @click.native="addSubmit">确 定</el-button>
            </div>
                
           
            
        </el-dialog>

    </section>
    
</template>

<script>
import { getUserListPage, removeUser,addUser,formateTime } from '../../api/api';
export default {
    data() {
        return {
            filters: {
                username: ''
            },
            users: [],
            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                username: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                repassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                ],
            },
            //新增界面数据
            addForm: {
                username: '',
                password: '',
                repassword:'',
                isadmin:false,
            }
        }
    },
    mounted:function(){
        this.getUsers()
    },
    methods: {
        getUsers() {
            getUserListPage().then((res) => {

                this.users = res.data.userList;
                for(var i=0;i<this.users.length;i++){
                    if (this.users[i].isadmin){
                        this.users[i].isadmin = "是"
                    }else{
                        this.users[i].isadmin = "否"
                    }
                    var time= this.users[i].create_time;
                    var times=formateTime(time) 
                    this.users[i].create_time = times;
                }
			});
        },
        
        //显示新增界面
        handleAdd: function () {
            this.addFormVisible = !this.addFormVisible;
            this.$nextTick(() => {
            this.$refs['addForm'].resetFields()
            })
        },

        handleDel:function(index,row){
            this.$confirm('确认删除该记录吗？','提示',{
                type:'warning'
            }).then(()=>{
                let para = {id:row.id};
                removeUser(para).then((res) => {
                    if (res.data.code == 200){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        });
                        this.getUsers()
                    }else if(res.data.code == 403){
                        this.$message({
                            message:'无此权限',
                            type:'warning'
                        });
                    }
                    
                });

            }).catch(()=>{

            })
        },

        addSubmit: function() {
            this.$refs.addForm.validate((valid) =>{
                if (valid) {
                    this.$confirm('确认提交吗？','提示',{}).then(() => {
                        let para = Object.assign({},this.addForm);

                        addUser(para).then((res) => {

                            if (res.data.code == 1009){
                                this.$message({
                                message:res.data.message,
                                type:'warning'
                                });
                            }else if(res.data.code == 403){
                                this.$message({
                                message:'无此权限',
                                type:'warning'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                            }else{
                                this.$message({
                                message:'提交成功',
                                type:'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
                            }
                            })


                        if (para.password === para.repassword){
                            addUser(para).then((res) => {

                                if (res.data.code == 1009){
                                this.$message({
                                message:'两次输入的密码不一致',
                                type:'warning'
                                });
                            }else{
                                this.$message({
                                message:'提交成功',
                                type:'success'
                            });
                            
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getUsers();
                            }
                            
                            })
                        }else {
                            this.$message({
                                message:'两次输入的密码不一致',
                                type:'warning'
                            });
                            
                        }
                        
                    })
                }
            });
        },

    }
}
</script>

<style scoped>

</style>
