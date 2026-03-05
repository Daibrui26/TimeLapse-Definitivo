import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastState {
  visible: boolean
  message: string
  type: ToastType
}

// Estado global compartido (singleton)
const state = ref<ToastState>({
  visible: false,
  message: '',
  type: 'info'
})

let hideTimer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 3500) {
    if (hideTimer) clearTimeout(hideTimer)
    state.value = { visible: true, message, type }
    hideTimer = setTimeout(() => {
      state.value.visible = false
    }, duration)
  }

  const success = (msg: string) => show(msg, 'success')
  const error   = (msg: string) => show(msg, 'error')
  const info    = (msg: string) => show(msg, 'info')
  const hide    = () => { state.value.visible = false }

  return { state, show, success, error, info, hide }
}