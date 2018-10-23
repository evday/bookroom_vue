<template>
  <section>
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="会议日期">
          <el-date-picker v-model="formInline.value6" 
          type="daterange" align="right" unlink-panels 
          range-separator="至" start-placeholder="开始日期" 
          end-placeholder="结束日期" :picker-options="formInline.pickerOptions2" 
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.value8" filterable multiple placeholder="请选择">
            <el-option v-for="item in formInline.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchMeetInfo">查询</el-button>
          <el-button type="success" icon="el-icon-plus" @click="handleAdd">发起会议</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="meeting_data" border style="width: 100%">
      <el-table-column fixed prop="start" label="开始时间" width="150"></el-table-column>
      <el-table-column fixed prop="end" label="结束时间" width="150"></el-table-column>
      <el-table-column fixed prop="roomname" label="会议室" width="150"></el-table-column>
      <el-table-column prop="username" label="预订人" width="100"></el-table-column>
      <el-table-column prop="theme" label="会议主题" width="300"></el-table-column>
      <el-table-column prop="member" label="参会人员" width="250"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="ishow(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDel(scope.$index, scope.row)" v-show="ishow(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="发起会议" :visible.sync="formInline.dialogTableVisible" width="600px">
      <el-form :model="meetingInfo" label-width="80px" :rules="meetingInfoRules" ref="meetingInfo">
        <el-form-item label="会议日期" class="data-picker" prop="date">
          <el-date-picker v-model="meetingInfo.date" type="date" placeholder="选择日期" :picker-options="pickerOptions0" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width:480px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议时间" required>
          <el-col :span="11">
            <el-form-item prop="start">
              <el-time-select placeholder="起始时间" v-model="meetingInfo.start" :picker-options="{
                      start: '09:00',
                      step: '00:15',
                      end: '21:00'
                    }">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;&nbsp;至</el-col>
          <el-col :span="11">
            <el-form-item prop="end">
              <el-time-select placeholder="结束时间" v-model="meetingInfo.end" :picker-options="{
                      start: '09:00',
                      step: '00:15',
                      end: '21:00',
                      minTime: meetingInfo.start
                    }">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="会议室" prop="roomId">
          <el-select v-model="meetingInfo.roomId" filterable placeholder="请选择会议室" style="width:480px;">
            <el-option v-for="item in formInline.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参会人员" prop="member">
          <el-input v-model="meetingInfo.member" placeholder="请注明参会人员"></el-input>
        </el-form-item>
        <el-form-item label="会议主题" prop="theme">
          <el-input type="textarea" :rows="2" width="400px" placeholder="请注明会议主题" v-model="meetingInfo.theme">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="createMeeting">立即创建</el-button>
        <el-button @click="formInline.dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑会议" :visible.sync="editFormVisible" width="600px">
      <el-form :model="editForm" label-width="80px" :rules="editFormInfoRules" ref="editForm">
        <el-form-item label="会议日期" class="data-picker" prop="date">
          <el-date-picker v-model="editForm.date" type="date" placeholder="选择日期" :picker-options="pickerOptions0" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width:480px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议时间" required>
          <el-col :span="11">
            <el-form-item prop="start">
              <el-time-select placeholder="起始时间" v-model="editForm.start" :picker-options="{
                      start: '09:00',
                      step: '00:15',
                      end: '21:00'
                    }">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;&nbsp;至</el-col>
          <el-col :span="11">
            <el-form-item prop="end">
              <el-time-select placeholder="结束时间" v-model="editForm.end" :picker-options="{
                      start: '09:00',
                      step: '00:15',
                      end: '21:00',
                      minTime: editForm.start
                    }">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="会议室" prop="roomname">
          <el-select v-model="editForm.roomId" filterable placeholder="请选择会议室" style="width:480px;">
            <el-option v-for="item in formInline.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参会人员" prop="member">
          <el-input v-model="editForm.member" placeholder="请注明参会人员"></el-input>
        </el-form-item>
        <el-form-item label="会议主题" prop="theme">
          <el-input type="textarea" :rows="2" width="400px" placeholder="请注明会议主题" v-model="editForm.theme">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editMeetInfo">确认</el-button>
        <el-button @click="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import { addMeet, getAllMeetInfo, formateTime, removeMeetInfo,editMeetInfo,searchMeetInfo } from '../../api/api'
export default {
  data() {
    return {
      formInline: {
        value6: [],
        value8: [],
        dialogTableVisible: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        options: [],
      },
      meeting_data: [],
      meetingInfo: {
        date: '',
        start: '',
        end: '',
        member: '',
        theme: '',
        roomId: '',
      },
      editForm:{},
      editFormInfoRules:{
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' },
        ],
        start: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
        ],
        end: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
        ],
        member: [
          { required: true, message: '请输入参会人员', trigger: 'blur' },
        ],
        theme: [
          { required: true, message: '请输入会议主题', trigger: 'blur' },
        ],
        roomId: [
          { required: true, message: '请选择会议室', trigger: 'blur' },
        ]
      },
      editFormVisible:false,
      meetingInfoRules: {
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' },
        ],
        start: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
        ],
        end: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
        ],
        member: [
          { required: true, message: '请输入参会人员', trigger: 'blur' },
        ],
        theme: [
          { required: true, message: '请输入会议主题', trigger: 'blur' },
        ],
        roomId: [
          { required: true, message: '请选择会议室', trigger: 'blur' },
        ]
      },
      username: this.$store.state.userInfo.username,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
    }
  },
  mounted: function () {
    this.getallRoom()
    this.getMeetingInfo()
  },
  methods: {
    //获取会议信息
    getMeetingInfo: function () {
      this.meeting_data = []
      getAllMeetInfo().then((res) => {
        var that = this
        if (res.data.code == 200) {
          this.$options.methods.formateData.bind(this)(res.data.data)
        }
      })
    },
    //显示添加界面
    handleAdd: function () {
      this.formInline.dialogTableVisible = !this.formInline.dialogTableVisible;
      this.$nextTick(() => {
        this.$refs['meetingInfo'].resetFields()
      })
    },
    //显示编辑界面
    handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        var date_start = this.editForm.start.split(" ")
        this.editForm.date = date_start[0]
        this.editForm.start = date_start[1]
        this.editForm.end = this.editForm.end.split(" ")[1]

        for (var i=0 ;i < this.formInline.options.length; i++){
          if (this.formInline.options[i].label == this.editForm.roomname){
            this.editForm.roomId = this.formInline.options[i].value
          }
        }

        console.log(this.editForm)
    },
    //获取所有会议室
    getallRoom: function () {
      var that = this
      that.$store.commit('getAllRoom')
      that.$store.state.allRoom = this.formInline.options
    },
    //添加会议记录
    createMeeting: function () {
      this.$refs.meetingInfo.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            let info = Object.assign({}, this.meetingInfo);
            info.startTime = info.date + ' ' + info.start
            info.endTime = info.date + ' ' + info.end
            info.username = this.username
            addMeet(info).then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$refs['meetingInfo'].resetFields();
                this.formInline.dialogTableVisible = false;
                this.getMeetingInfo()
              }else if(res.data.code == 1013){
                this.$message({
                  message: '该会议室该时间段已经被预定',
                  type: 'warning'
                });
                this.$refs['meetingInfo'].resetFields();
                this.formInline.dialogTableVisible = false;
              }else if(res.data.code == 1014){
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                });
                this.$refs['meetingInfo'].resetFields();
                this.formInline.dialogTableVisible = false;
              }else {
                this.$message({
                  message: '添加失败',
                  type: 'warning'
                });
              }
            })
          })
        }
      })
    },
    //根据当前用户显示该用户的权限
    ishow: function (row) {
      var myDate = new Date();
      var lastTime = myDate.getFullYear().toString()+'-'+(myDate.getMonth()+1).toString()+'-'+myDate.getDate().toString()+' '+myDate.getHours()+':'+myDate.getMinutes()
      var times = formateTime(lastTime)
      var endtime = formateTime(row.end)
      if (row.username == this.username && endtime >= times ) {
        return true
      } else {
        return false
      }
    },
    //删除会议记录
    handleDel: function (index, row) {
      this.$confirm('确认取消这次预定吗？', '提示', {
        type: 'warning'
      }).then(() => {
        if (row.username != this.username) {
          this.$message({
            message: '您没有权利删除这条记录',
            type: "warning",
          })
        } else {
          let param = { id: row.id,username:this.username}
          removeMeetInfo(param).then((res) => {
            console.log(res)
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getMeetingInfo()
            }else if(res.code == 1012){
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }else {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
            }
          }).catch(() => {

          })
        }
      })
    },
    //编辑会议记录
    editMeetInfo:function(index,row){
      this.$refs.editForm.validate((valid) =>{
        if(valid){
          this.$confirm('确认提交吗？','提示',{}).then(() =>{
            console.log(this.editForm)
            let params = 
            {
              id : this.editForm.id,
              startTime : this.editForm.date + ' ' + this.editForm.start,
              endTime : this.editForm.date + ' ' + this.editForm.end,
              theme : this.editForm.theme,
              member : this.editForm.member,
              roomId : this.editForm.roomId,
              username : this.username
            }
            editMeetInfot(params).then((res) =>{
              console.log(res)
              if (res.code == 200){
                this.$message({
                  message:'修改成功',
                  type:'success'
                });
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getMeetingInfo()
                
              }else if(res.code == 1012) {
                this.$message({
                  message:res.data.message,
                  type:'warning'
                })
              }else {
                this.$message({
                  message:'修改失败',
                  type:'warning'
                });
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
              }
            })
          })
        }
      })
    },
    //格式化数据
    formateData:function(data){
      this.meeting_data = []
      this.meeting_data = data
      for (var i = 0; i < this.meeting_data.length; i++) {

        var stime = this.meeting_data[i].start
        var times = formateTime(stime)
        this.meeting_data[i].start = times


        var etime = this.meeting_data[i].end
        var etimes = formateTime(etime)
        this.meeting_data[i].end = etimes

      }
    },
    //查询会议记录
    searchMeetInfo:function(){
      if (this.formInline.value6.length == 0 && this.formInline.value8.length == 0){
        this.$message({
          message:'请选择查询时间或者需要查询的会议室',
          type:'warning'
        });
      }else if(this.formInline.value8.length == 0) {
        let params = 
        {
          s:this.formInline.value6[0],
          e:this.formInline.value6[1],
          roomsid:'0'
        }
        this.formInline.value6 = []
        searchMeetInfo(params).then((res) =>{
          if (res.code == 200){
            this.$options.methods.formateData.bind(this)(res.data)
          }else if (res.code == 404) {
              this.$message({
                message:res.message,
                type:'warning'
              })
          }
        })
      }else if(this.formInline.value6.length == 0) {
        let params = 
        {
          s:this.formInline.value6[0],
          e:this.formInline.value6[1],
          roomsid:this.formInline.value8.join('|')
        }
        this.formInline.value8 = []
        searchMeetInfo(params).then((res) =>{
          if (res.code == 200){
            this.$options.methods.formateData.bind(this)(res.data)
          }else if (res.code == 404) {
            this.$message({
              message:res.message,
              type:'warning'
            })
          }
        })

      }else {
        let params = 
        {
          s:this.formInline.value6[0],
          e:this.formInline.value6[1],
          roomsid:this.formInline.value8.join('|')
        }
        this.formInline.value6 = []
        this.formInline.value8 = []
        searchMeetInfo(params).then((res) =>{
          if (res.code == 200){
          this.$options.methods.formateData.bind(this)(res.data)
          }else if (res.code == 404) {
            this.$message({
              message:res.message,
              type:'warning'
            })
          }
          
        })
      }
      
    }
  }
}
</script>

<style scoped>
.start {
    display: inline;
}
</style>

