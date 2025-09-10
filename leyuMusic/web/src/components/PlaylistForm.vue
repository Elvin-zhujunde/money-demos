<template>
  <a-modal
    :visible="visible"
    :title="playlist ? '编辑歌单' : '创建歌单'"
    @ok="handleSubmit"
    @cancel="$emit('cancel')"
    :confirmLoading="loading"
  >
    <a-form :form="form">
      <a-form-item label="歌单名称">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入歌单名称' }],
              initialValue: playlist?.name
            }
          ]"
          placeholder="请输入歌单名称"
        />
      </a-form-item>
      <a-form-item label="歌单简介">
        <a-textarea
          v-decorator="[
            'description',
            {
              initialValue: playlist?.description
            }
          ]"
          placeholder="请输入歌单简介"
          :rows="4"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'PlaylistForm',
  props: {
    visible: Boolean,
    playlist: Object
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  methods: {
    handleSubmit() {
      this.form.validateFields(async (errors, values) => {
        if (errors) return

        this.loading = true
        try {
          if (this.playlist) {
            // 编辑歌单
            await this.$http.put(`/api/playlists/${this.playlist.id}`, values)
          } else {
            // 创建歌单
            await this.$http.post('/api/playlists', values)
          }
          this.$message.success(this.playlist ? '编辑成功' : '创建成功')
          this.$emit('success')
        } catch (error) {
          console.error(error)
          this.$message.error('操作失败')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script> 