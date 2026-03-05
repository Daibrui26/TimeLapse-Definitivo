import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export interface ConfirmState extends ConfirmOptions {
  visible: boolean
  resolve: ((value: boolean) => void) | null
}

// Estado global compartido (singleton)
const state = ref<ConfirmState>({
  visible: false,
  message: '',
  title: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  danger: false,
  resolve: null
})

export function useConfirm() {
  function confirm(options: ConfirmOptions | string): Promise<boolean> {
    const opts: ConfirmOptions = typeof options === 'string'
      ? { message: options }
      : options

    return new Promise((resolve) => {
      state.value = {
        visible: true,
        message: opts.message,
        title: opts.title ?? '',
        confirmText: opts.confirmText ?? 'Confirmar',
        cancelText: opts.cancelText ?? 'Cancelar',
        danger: opts.danger ?? false,
        resolve
      }
    })
  }

  function accept() {
    state.value.resolve?.(true)
    state.value.visible = false
  }

  function cancel() {
    state.value.resolve?.(false)
    state.value.visible = false
  }

  return { state, confirm, accept, cancel }
}