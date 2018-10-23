<template>
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item  label="设备名称">
            <el-input v-model="value" placeholder="输入要查询的设备" filterable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  icon="el-icon-search" @click="searchEquipment()">查询</el-button>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd()">添加设备</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="device_data" border style="width: 100%">
          <el-table-column fixed prop="id" label="ID" width="100"></el-table-column>
          <el-table-column fixed prop="equipname" label="设备名称" width="150"></el-table-column>
          <el-table-column fixed prop="brand" label="设备品牌" width="150"></el-table-column>
          <el-table-column fixed prop="pmodel" label="设备型号" width="150"></el-table-column>
       
          <el-table-column prop="num" label="设备数量" width="100"></el-table-column>
          <el-table-column prop="create_time" label="添加时间" width="250"></el-table-column>
          <el-table-column fixed="right" label="操作" width="*">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDel(scope.$index, scope.row)">删除设备</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加设备 -->
        <el-dialog title="添加设备" :visible.sync="dialogTableVisible" width="600px">
            
            <el-form :model="meetingInfo" label-width="80px" :rules="meetingInfoRules" ref="meetingInfo">
                <el-form-item label="设备名称" prop="name">
                <el-input v-model="meetingInfo.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="设备品牌" prop="brand">
                <el-input v-model="meetingInfo.brand" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="设备型号" prop="bmodel">
                <el-input v-model="meetingInfo.bmodel" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="当前库存" prop="store">
                <el-input type="number" v-model="meetingInfo.store" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false" type="default">取 消</el-button>
                <el-button type="primary" @click.native="addSubmit">立即创建</el-button>
            </div>
        </el-dialog>

        <!-- 编辑设备 -->

        <el-dialog title="编辑设备" :visible.sync="editFormVisible" width="600px">
            
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="设备名称" prop="equipname">
                <el-input v-model="editForm.equipname" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="设备品牌" prop="brand">
                <el-input v-model="editForm.brand" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="设备型号" prop="pmodel">
                <el-input v-model="editForm.pmodel" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="当前库存" prop="num">
                <el-input type="number" v-model="editForm.num" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false" type="default">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit">确定</el-button>
            </div>
        </el-dialog>

    </el-col>
</template>

<script>
import { addEquipment,getAllEquipment,removeEquip,editEquipment,searchEquipment,formateTime } from '../../api/api';
export default {
    data() {
        return {
            value:'',
            meetingInfoRules: {
                name: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' },
                ],
                brand: [
                    { required: true, message: '请输入设备品牌', trigger: 'blur' },
                ],
                bmodel: [
                    { required: true, message: '请输入设备型号', trigger: 'blur' },
                ],
                store: [
                    { required: true, message: '请输入添加数量', trigger: 'blur' },
                ],
            },
            meetingInfo: {
                name:  '',
                brand: '',
                bmodel: '',
                store: 1,
            },
            editFormVisible: false,
            editForm:{
                id:'',
                equipname:  '',
                brand: '',
                pmodel: '',
                num: '',
            },
            editFormRules: {
                equipname: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' },
                ],
                brand: [
                    { required: true, message: '请输入设备品牌', trigger: 'blur' },
                ],
                pmodel: [
                    { required: true, message: '请输入设备型号', trigger: 'blur' },
                ],
                num: [
                    { required: true, message: '请输入添加数量', trigger: 'blur' },
                ],
            },
            dialogTableVisible: false,
            device_data: []
        }
    },
    mounted:function(){
        this.getAllEquipment()
    },
    methods: {
        //显示添加界面
        handleAdd:function() {
            this.dialogTableVisible = !this.dialogTableVisible;
            this.$nextTick(() => {
            this.$refs['meetingInfo'].resetFields()
            })
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //添加记录
        addSubmit: function() {
            this.$refs.meetingInfo.validate((valid)=>{
                if (valid) {
                    this.$confirm('确认提交吗？','提示',{}).then(() =>{
                        let info = Object.assign({},this.meetingInfo);
                        info.store = parseInt(info.store)
                        addEquipment(info).then((res)=>{
                            if (res.data.code == 200){
                                this.$message({
                                message:'添加成功',
                                type:'success'
                                });
                                this.$refs['meetingInfo'].resetFields();
                                this.dialogTableVisible = false;
                                this.getAllEquipment()
                            }else if(res.data.code == 403){
                                this.$message({
                                message: '无此权限',
                                type: 'warning'
                                });
                                this.dialogTableVisible = false;
                            }else {
                                this.$message({
                                message: '添加失败',
                                type: 'warning'
                                });
                                this.dialogTableVisible = false;
                            }
                        })
                    })
                }
            })
        },
        //编辑记录
        editSubmit:function() {
            this.$refs.editForm.validate((valid) =>{
                if (valid) {
                    this.$confirm('确认提交吗？','提示',{}).then(() =>{
                        let para = 
                        {
                            id:this.editForm.id,
                            name:this.editForm.equipname,
                            brand:this.editForm.brand,
                            bmodel:this.editForm.pmodel,
                            store:parseInt(this.editForm.num)
                        };

                        
                        editEquipment(para).then((res) =>{
                            if (res.code == 200){
                                this.$message({
                                    message:'提交成功',
                                    type:'success'
                                });
                                this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAllEquipment();
                            }else if(res.code == 403){
                                this.$message({
                                message: '无此权限',
                                type: 'warning'
                                });
                                this.editFormVisible = false;
                            }else {
                                this.$message({
                                message: '编辑失败',
                                type: 'warning'
                                });
                                this.editFormVisible = false;
                            }
                        });
                    })
                }
            })
        },
        //获取所有记录
        getAllEquipment:function(){
            getAllEquipment().then((res)=>{
                if (res.data.code == 200){
                    this.device_data = res.data.data
                    for(var i=0;i<this.device_data.length;i++){
                    var time= this.device_data[i].create_time;
                    var times=formateTime(time) 
                    this.device_data[i].create_time = times;
                }
                }
            })
        },
        //删除记录
        handleDel:function(index,row) {
            this.$confirm('确认删除该条记录吗？','提示',{
                type:'warning'
            }).then(()=>{
                let param = {id : row.id}
                removeEquip(param).then((res) =>{
                    console.log(res)
                    if (res.code == 200 ){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        });
                        this.getAllEquipment()
                    }else if(res.code == 403){
                        this.$message({
                        message: '无此权限',
                        type: 'warning'
                        });
                        this.editFormVisible = false;
                    }else {
                        this.$message({
                        message: '删除失败',
                        type: 'warning'
                        });
                        this.editFormVisible = false;
                    }
                }).catch(()=>{

                })
            })
        },
        //查询记录
        searchEquipment:function(){
            if (this.value == ''){
                this.$message({
                    message:'请输入您要搜索的设备名称',
                    type:'warning'
                })
            }else {
                let para = {keyword:this.value}
                searchEquipment(para).then((res)=>{
                    console.log(res.data)
                    if (res.data.length == 0){
                        this.$message({
                            message:'没有找到您要查找的内容',
                            type:'warning'
                        });
                        this.value = ''
                    }else {
                        this.device_data = res.data
                        for(var i=0;i<this.device_data.length;i++){
                            var time= this.device_data[i].create_time;
                            var times=formateTime(time)
                            this.device_data[i].create_time = times;
                        }
                    }
                })
            }
        },
    }
}
</script>

<style scoped>

</style>


