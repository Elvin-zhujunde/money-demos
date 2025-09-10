export const highlight = {
  mounted(el, binding) {
    const defaultColor = binding.value || '#e6f7ff'
    const originalBackground = el.style.background
    const originalTransition = el.style.transition
    
    el.style.transition = 'background-color 0.3s'
    
    el.addEventListener('mouseenter', () => {
      el.style.backgroundColor = defaultColor
    })
    
    el.addEventListener('mouseleave', () => {
      el.style.backgroundColor = originalBackground
    })
    
    // 清理函数
    el._cleanup = () => {
      el.style.transition = originalTransition
      el.style.backgroundColor = originalBackground
    }
  },
  
  unmounted(el) {
    // 组件卸载时清理
    el._cleanup && el._cleanup()
  }
} 