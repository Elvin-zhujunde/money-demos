import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    travels: [
      {
        id: 1,
        title: 'Vue3 组合式 API 实战指南',
        summary: '深入探讨 Vue3 组合式 API 的使用技巧和最佳实践',
        content: `组合式 API 是 Vue3 中最重要的特性之一。通过 setup 函数，我们可以更好地组织和复用组件逻辑。

        在这篇文章中，我们将探讨：
        1. ref 和 reactive 的使用场景
        2. 生命周期钩子的最佳实践
        3. 组合式函数（Composables）的抽取和复用
        4. 性能优化技巧
        
        通过实际的代码示例，让您更好地理解和应用组合式 API。`,
        author: '张三',
        date: '2024-03-15',
        coverImage: 'https://picsum.photos/800/600?random=1',
        views: 1234,
        likes: 88,
        featured: true,
        category: '前端开发',
        location: '技术专栏',
        images: [
          'https://picsum.photos/800/600?random=11',
          'https://picsum.photos/800/600?random=12',
          'https://picsum.photos/800/600?random=13'
        ]
      },
      {
        id: 2,
        title: 'Node.js 性能优化实践',
        summary: '探索 Node.js 应用的性能优化策略和监控方案',
        content: `在构建大规模 Node.js 应用时，性能优化是一个永恒的话题。本文将分享一些实用的优化技巧：

        1. 内存泄漏的识别与处理
        2. 异步操作的优化
        3. 数据库查询优化
        4. 缓存策略的使用
        
        同时，我们还将介绍如何使用各种工具进行性能监控和分析。`,
        author: '李四',
        date: '2024-03-10',
        coverImage: 'https://picsum.photos/800/600?random=2',
        views: 2345,
        likes: 120,
        featured: true,
        category: '后端开发',
        location: '技术专栏',
        images: [
          'https://picsum.photos/800/600?random=21',
          'https://picsum.photos/800/600?random=22',
          'https://picsum.photos/800/600?random=23'
        ]
      },
      {
        id: 3,
        title: 'Docker 容器化部署指南',
        summary: '从零开始学习 Docker 容器化技术和最佳部署实践',
        content: `Docker 已经成为现代应用部署的标准。本文将带您深入了解 Docker：

        1. Docker 基础概念
        2. Dockerfile 的编写技巧
        3. Docker Compose 的使用
        4. 容器编排和服务发现
        
        通过实际案例，掌握容器化部署的核心要点。`,
        author: '王五',
        date: '2024-03-05',
        coverImage: 'https://picsum.photos/800/600?random=3',
        views: 3456,
        likes: 150,
        featured: true,
        category: 'DevOps',
        location: '技术专栏',
        images: [
          'https://picsum.photos/800/600?random=31',
          'https://picsum.photos/800/600?random=32',
          'https://picsum.photos/800/600?random=33'
        ]
      }
    ],
    currentTravel: null
  }),
  getters: {
    featuredTravels: (state) => 
      state.travels.filter(travel => travel.featured),
    getTravelById: (state) => (id) => 
      state.travels.find(travel => travel.id === parseInt(id))
  },
  actions: {
    async fetchTravels() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.travels) 
        }, 500)
      })
    },
    async fetchTravelById(id) {
      return new Promise(resolve => {
        setTimeout(() => {
          const travel = this.getTravelById(id)
          resolve(travel)
        }, 500)
      })
    }
  }
}) 