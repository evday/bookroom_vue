<template>
  <section>
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="options">
        <el-form-item label="会议室名称">
          <el-select v-model="value" filterable placeholder="请选择会议室">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchRoom">查询</el-button>
          <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加会议室</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="service_data" border style="width: 100%">
      <el-table-column fixed prop="id" label="ID" width="100"></el-table-column>
      <el-table-column fixed prop="roomname" label="名称" width="150"></el-table-column>
      <el-table-column fixed prop="location" label="位置" width="150"></el-table-column>
      <el-table-column fixed prop="capacity" label="可容纳人数" width="150"></el-table-column>
      <el-table-column fixed prop="state" label="开放状态" width="150"></el-table-column>
      <el-table-column left fixed prop="Equipment" label="基础设施" width="400"></el-table-column>
      <el-table-column fixed="left" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加会议室" :visible.sync="dialogTableVisible" width="600px">
      <el-form class="form" :model="meetingInfo" label-width="100px" :rules="meetingInfoRules" ref="meetingInfo">
        <el-form-item label="会议室名称" prop="roomname">
          <el-input v-model="meetingInfo.roomname" clearable></el-input>
        </el-form-item>
        <el-form-item label="会议室位置" prop="location">
          <el-input v-model="meetingInfo.location" clearable></el-input>
        </el-form-item>
        <el-form-item label="可容纳人数" prop="capacity">
          <el-input v-model="meetingInfo.capacity" clearable maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="会议室状态">
          <el-switch v-model="meetingInfo.state" active-text="开放中" inactive-text="维护中"></el-switch>
        </el-form-item>
        <el-form-item label="基础设施">
          <Badge v-for="(item,index) in allEquipment" :key="index" :item="item" :value="0"></Badge>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="addSubmit">立即创建</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑会议室" :visible.sync="editFormVisible" width="600px">
      <el-form class="form" :model="editForm" label-width="100px" :rules="meetingInfoRules" ref="editForm">
        <el-form-item label="会议室名称" prop="roomname">
          <el-input v-model="editForm.roomname" clearable></el-input>
        </el-form-item>
        <el-form-item label="会议室位置" prop="location">
          <el-input v-model="editForm.location" clearable></el-input>
        </el-form-item>
        <el-form-item label="可容纳人数" prop="capacity">
          <el-input v-model="editForm.capacity" clearable maxlength="5"></el-input>
        </el-form-item>
        <el-form-item label="会议室状态">
          <el-switch v-model="editForm.state" active-text="开放中" inactive-text="维护中"></el-switch>
        </el-form-item>
        <el-form-item label="基础设施">
          <Ownbadge v-for="(item,index) in ownEquipment" :key="index" :item="item"></Ownbadge>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editSubmit">确定</el-button>
        <el-button @click="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import { getAllEquipment, createRoom, getAllRoom, removeRoom, editRoom, searchRoom } from '../../api/api'
import Badge from '../common/badge'
import Ownbadge from '../common/ownbadge'
export default {
  components: {
    Badge,
    Ownbadge,
  },
  data() {
    return {
      meetingInfoRules: {
        name: [
          { required: true, message: '请输入会议室名称', trigger: 'blur' },
        ],
        location: [
          { required: true, message: '请输入会议室位置', trigger: 'blur' },
        ],
        cap: [
          { required: true, message: '请输入会议室最大容量', trigger: 'blur' },
        ],
      },
      meetingInfo: {
        roomname: '',
        location: '',
        capacity: '',
        state: true,
      },
      editForm: {
        id: '',
        roomname: '',
        location: '',
        capacity: '',
        state: 1,
      },
      allEquipment: [],
      service_data: [],
      ownEquipment: [],
      dialogTableVisible: false,
      editFormVisible: false,
      options: [],
      value: ''
    }
  },

  mounted: function () {
    this.getAllRoom()
    this.getAllEquipment()
  },
  methods: {
    //获取所有设备
    getAllEquipment: function () {
      getAllEquipment().then((res) => {
        if (res.data.code == 200) {
          this.allEquipment = res.data.data
        }
      })
    },
    //获取所有会议室
    getAllRoom: function () {
      getAllRoom().then((result) => {
        if (result.data.code == 200) {
          this.service_data = result.data.data
          this.options = []
          for (var i = 0; i < this.service_data.length; i++) {
            var obj = new Object()
            obj['value'] = this.service_data[i].roomname
            obj['label'] = this.service_data[i].roomname
            this.options.push(obj)
            if (this.service_data[i].state) {
              this.service_data[i].state = '开放'
            } else {
              this.service_data[i].state = '维护'
            }
            var s = ''
            for (var j = 0; j < this.service_data[i].Equipment.length; j++) {
              var str = this.service_data[i].Equipment[j]['name'] + '*' + this.service_data[i].Equipment[j]['num']
              s += str + ' '
            }
            this.service_data[i].Equipment = s

          }
        }
      })
    },
    //显示新增界面
    handleAdd: function () {
      this.dialogTableVisible = !this.dialogTableVisible;
      this.$nextTick(() => {
        this.$refs['meetingInfo'].resetFields()
      })
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.ownEquipment = []
      this.editForm = Object.assign({}, row);
      if (row.state == '开放') {
        this.editForm.state = true
      } else if (row.state == '维护') {
        this.editForm.state == false
      }
      var ss = row.Equipment.trim().split(" ")
      for (var i = 0; i < ss.length; i++) {
        var name = ss[i].split('*')[0]
        var num = ss[i].split('*')[1]
        var obj = new Object()
        obj['name'] = name
        obj['num'] = num
        this.ownEquipment.push(obj)
      }
    },
    //添加会议室
    addSubmit: function () {
      this.$refs.meetingInfo.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            let para = Object.assign({}, this.meetingInfo);
            para.equipment = []
            $('.item button').each(function () {
              var obj = new Object()
              var name = $(this).text()
              var value = $(this).siblings().last().text()
              if (value == 0) {
                return false
              } else {
                obj['name'] = name
                obj['num'] = value
                para.equipment.push(obj)
              }
            })
            createRoom(para).then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$refs['meetingInfo'].resetFields();
                this.dialogTableVisible = false;
                this.getAllRoom()
              } else if(res.data.code == 403){
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
    //删除会议室
    handleDel: function (index, row) {
      this.$confirm('确认删除这条记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let param = { id: row.id }
        removeRoom(param).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getAllRoom()
          } else if(res.code == 403){
                this.$message({
                  message: '无此权限',
                  type: 'warning'
                });
                
              }else {
                this.$message({
                  message: '删除失败',
                  type: 'warning'
                });
      
              }
        })
      })
    },
    //修改会议室
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交修改吗？', '提示', {}).then(() => {
            let params =
            {
              id: this.editForm.id,
              roomname: this.editForm.roomname,
              location: this.editForm.location,
              capacity: this.editForm.capacity,
              state: this.editForm.state
            }
            params.equipment = []
            $('.ownitem button').each(function () {
              var obj = new Object()
              var name = $(this).text()
              var value = $(this).siblings().last().text()
              if (value == 0) {
                return false
              } else {
                obj['name'] = name
                obj['num'] = value
                params.equipment.push(obj)
              }
            })
            editRoom(params).then((res) => {
              console.log(res)
              if (res.code == 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getAllRoom()
              } else if(res.code == 403){
                this.$message({
                  message: '无此权限',
                  type: 'warning'
                });
                this.editFormVisible = false;
              }else {
                this.$message({
                  message: '修改失败',
                  type: 'warning'
                });
                this.editFormVisible = false;
              }
            })
          })
        }
      })

    },
    //会议室查询
    searchRoom: function () {
      if (this.value == '') {
        this.$message({
          message: '请选择要搜索的会议室',
          type: 'warning'
        })
      } else {
        let para = { keyword: this.value }
        searchRoom(para).then((res) => {
          if (res.data.length == 0) {
            this.$message({
              message: '没有找到您要查找的内容',
              type: 'warning'
            });
            this.value = ''
          } else {
            this.service_data = res.data
            for (var i = 0; i < this.service_data.length; i++) {
              if (this.service_data[i].state) {
                this.service_data[i].state = '开放'
              } else {
                this.service_data[i].state = '维护'
              }
              var s = ''
              for (var j = 0; j < this.service_data[i].Equipment.length; j++) {
                var str = this.service_data[i].Equipment[j]['name'] + '*' + this.service_data[i].Equipment[j]['num']
                s += str + ' '
              }
              this.service_data[i].Equipment = s

            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.item {
    display: inline;
    padding-right: 20px;
}
.ownitem {
    display: inline;
    padding-right: 20px;
}
</style>



