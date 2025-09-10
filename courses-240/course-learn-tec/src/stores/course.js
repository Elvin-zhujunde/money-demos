import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCourseStore = defineStore('course', () => {
  const collectedCourses = ref([])

  const isCollected = (courseId) => {
    return collectedCourses.value.some(course => course.id === courseId)
  }

  const toggleCollect = (course) => {
    const index = collectedCourses.value.findIndex(item => item.id === course.id)
    if (index === -1) {
      collectedCourses.value.push(course)
    } else {
      collectedCourses.value.splice(index, 1)
    }
  }

  return {
    collectedCourses,
    isCollected,
    toggleCollect
  }
}) 