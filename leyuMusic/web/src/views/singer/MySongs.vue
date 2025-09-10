<template>
  <div class="my-songs">
    <div class="header">
      <h2>我的歌曲</h2>
      <a-button type="primary" @click="showUploadModal">
        <a-icon type="plus" />上传新歌曲
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="songs" rowKey="id">
      <template #cover="{ text }">
        <img :src="text" alt="封面" class="song-cover" />
      </template>

      <template #status="{ text }">
        <a-tag :color="text === 1 ? 'green' : 'red'">
          {{ text === 1 ? '已上架' : '已下架' }}
        </a-tag>
      </template>

      <template #isVip="{ text }">
        <a-tag :color="text ? 'gold' : ''">
          {{ text ? 'VIP' : '免费' }}
        </a-tag>
      </template>

      <template #action="{ record }">
        <a-space>
          <a-button type="link" @click="handleEdit(record)">编辑</a-button>
          <a-button 
            type="link" 
            @click="handleToggleStatus(record)"
            :style="{ color: record.status === 1 ? '#ff4d4f' : '#52c41a' }"
          >
            {{ record.status === 1 ? '下架' : '上架' }}
          </a-button>
          <a-popconfirm
            title="确定要删除这首歌吗？"
            @confirm="handleDelete(record.id)"
          >
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <!-- 上传/编辑歌曲弹窗 -->
    <a-modal
      :title="editingId ? '编辑歌曲' : '上传新歌曲'"
      :visible="modalVisible"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirmLoading="submitting"
    >
      <a-form :model="formData" :rules="rules" ref="form">
        <a-form-item label="歌曲名称" name="title">
          <a-input v-model:value="formData.title" />
        </a-form-item>
        
        <a-form-item label="封面图片" name="cover_image">
          <a-upload
            list-type="picture-card"
            :before-upload="beforeUpload"
            @change="handleCoverChange"
            :maxCount="1"
          >
            <div v-if="!formData.cover_image">
              <a-icon type="plus" />
              <div>上传封面</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="音频文件" name="file_url">
          <a-upload
            :before-upload="beforeUploadAudio"
            @change="handleAudioChange"
            :maxCount="1"
          >
            <a-button>
              <a-icon type="upload" />选择音频文件
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="是否VIP" name="is_vip">
          <a-switch v-model:checked="formData.is_vip" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'MySongs',
  setup() {
    const songs = ref([])
    const modalVisible = ref(false)
    const submitting = ref(false)
    const editingId = ref(null)
    const form = ref(null)

    const formData = ref({
      title: '',
      cover_image: '',
      file_url: '',
      is_vip: false
    })

    const columns = [
      {
        title: '封面',
        dataIndex: 'cover_image',
        slots: { customRender: 'cover' }
      },
      {
        title: '歌曲名称',
        dataIndex: 'title'
      },
      {
        title: '播放次数',
        dataIndex: 'play_count'
      },
      {
        title: '状态',
        dataIndex: 'status',
        slots: { customRender: 'status' }
      },
      {
        title: 'VIP',
        dataIndex: 'is_vip',
        slots: { customRender: 'isVip' }
      },
      {
        title: '操作',
        slots: { customRender: 'action' }
      }
    ]

    const fetchSongs = async () => {
      try {
        const res = await fetch('/api/singer/songs')
        songs.value = res.data
      } catch (error) {
        message.error('获取歌曲列表失败')
      }
    }

    const handleSubmit = async () => {
      try {
        submitting.value = true
        const formValues = await form.value.validate()
        
        if (editingId.value) {
          await fetch(`/api/singer/songs/${editingId.value}`, {
            method: 'PUT',
            data: formValues
          })
          message.success('更新成功')
        } else {
          await fetch('/api/singer/songs', {
            method: 'POST',
            data: formValues
          })
          message.success('上传成功')
        }
        
        modalVisible.value = false
        fetchSongs()
      } catch (error) {
        message.error('操作失败')
      } finally {
        submitting.value = false
      }
    }

    const handleToggleStatus = async (record) => {
      try {
        await fetch(`/api/singer/songs/${record.id}/status`, {
          method: 'PUT',
          data: { status: record.status === 1 ? 0 : 1 }
        })
        message.success('状态更新成功')
        fetchSongs()
      } catch (error) {
        message.error('操作失败')
      }
    }

    const handleDelete = async (id) => {
      try {
        await fetch(`/api/singer/songs/${id}`, {
          method: 'DELETE'
        })
        message.success('删除成功')
        fetchSongs()
      } catch (error) {
        message.error('删除失败')
      }
    }

    onMounted(() => {
      fetchSongs()
    })

    return {
      songs,
      columns,
      modalVisible,
      submitting,
      editingId,
      formData,
      form,
      handleSubmit,
      handleToggleStatus,
      handleDelete,
      // ... 其他方法
    }
  }
})
</script>

<style lang="less" scoped>
.my-songs {
  padding: 24px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .song-cover {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }
}
</style> 