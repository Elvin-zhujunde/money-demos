<template>
  <el-dialog
    :title="form.id ? '编辑收货地址' : '新增收货地址'"
    :visible.sync="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="收货人" prop="receiver">
        <el-input v-model="form.receiver" placeholder="请输入收货人姓名" />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      
      <el-form-item label="所在地区" required>
        <el-cascader
          v-model="region"
          :options="regionData"
          placeholder="请选择所在地区"
          @change="handleRegionChange"
        />
      </el-form-item>
      
      <el-form-item label="详细地址" prop="detail_address">
        <el-input
          v-model="form.detail_address"
          type="textarea"
          placeholder="请输入详细地址"
        />
      </el-form-item>
      
      <el-form-item>
        <el-checkbox v-model="form.is_default">设为默认地址</el-checkbox>
      </el-form-item>
    </el-form>
    
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { regionData } from '@/utils/region-data'

export default {
  name: 'AddressDialog',
  
  props: {
    value: Boolean,
    address: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      form: {
        id: '',
        receiver: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail_address: '',
        is_default: false
      },
      region: [],
      regionData,
      rules: {
        receiver: [{ required: true, message: '请输入收货人姓名' }],
        phone: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ],
        detail_address: [{ required: true, message: '请输入详细地址' }]
      }
    }
  },

  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    address: {
      handler(address) {
        if (!address.id) return
        Object.assign(this.form, address)
        this.region = [address.province, address.city, address.district]
      },
      immediate: true
    }
  },

  methods: {
    handleRegionChange(value) {
      if (value.length === 3) {
        this.form.province = value[0]
        this.form.city = value[1]
        this.form.district = value[2]
      }
    },

    async handleSubmit() {
      try {
        await this.$refs.formRef.validate()
        
        // 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.form.user_id = userInfo.id
        
        if (this.form.id) {
          await this.$axios.put(`/api/addresses/${this.form.id}`, this.form)
        } else {
          await this.$axios.post('/api/addresses', this.form)
        }
        
        this.$message.success(this.form.id ? '更新成功' : '添加成功')
        this.$emit('success')
        this.visible = false
      } catch (error) {
        if (error.name !== 'ValidationError') {
          console.error('保存地址失败:', error)
          this.$message.error('保存失败')
        }
      }
    },

    handleClose() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
      Object.assign(this.form, {
        id: '',
        receiver: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail_address: '',
        is_default: false
      })
      this.region = []
    },

    // 删除地址
    async handleDeleteAddress(id) {
      try {
        await this.$confirm('确定要删除该地址吗?', '提示', {
          type: 'warning'
        });
        const res = await this.$axios.delete(`/api/addresses/${id}`);
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.fetchAddresses();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除地址失败:', error);
          const message = error.response && error.response.data ? error.response.data.message : '删除失败';
          this.$message.error(message);
        }
      }
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>