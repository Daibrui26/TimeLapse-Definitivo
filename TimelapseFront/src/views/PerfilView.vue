<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--perfil">
      <section class="card card--perfil">
        <div class="perfil-header">
          <h1 class="perfil-header__title">Perfil</h1>
          <button class="perfil-header__btn" @click="toggleEdit">
            {{ isEditing ? 'Guardar' : 'Editar' }}
          </button>
        </div>

        <div class="perfil-user">
          <!-- AVATAR CLICKEABLE -->
          <div class="perfil-user__avatar" @click="triggerFotoInput">
            <img
              :src="authStore.usuario?.fotoPerfil || '/src/assets/img/Perfil.png'"
              alt="Usuario"
              class="perfil-user__img"
            />
            <div class="perfil-user__avatar-overlay">
              <span>📷</span>
            </div>
          </div>

          <!-- Input oculto -->
          <input
            ref="fotoInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="subirFoto"
          />

          <p v-if="subiendo" class="perfil-user__foto-estado">Subiendo foto...</p>
          <p v-if="errorFoto" class="perfil-user__foto-error">{{ errorFoto }}</p>

          <h2 class="perfil-user__name">{{ authStore.usuario?.nombre }}</h2>
          <p class="perfil-user__email">{{ authStore.usuario?.email }}</p>
        </div>

        <form class="perfil-form" @submit.prevent="toggleEdit">
          <div class="perfil-form__group">
            <label class="perfil-form__label">Nombre</label>
            <input
              v-bind="nombreAttrs"
              v-model="nombre"
              type="text"
              class="perfil-form__input"
              :class="{ 'form__input--error': errors.nombre }"
              :disabled="!isEditing"
            />
            <span v-if="errors.nombre && isEditing" class="form__error-msg">{{ errors.nombre }}</span>
          </div>

          <div class="perfil-form__group">
            <label class="perfil-form__label">Correo</label>
            <input
              v-bind="emailAttrs"
              v-model="email"
              type="email"
              class="perfil-form__input"
              :class="{ 'form__input--error': errors.email }"
              :disabled="!isEditing"
            />
            <span v-if="errors.email && isEditing" class="form__error-msg">{{ errors.email }}</span>
          </div>

          <div class="perfil-form__group">
            <label class="perfil-form__label">Contraseña</label>
            <input
              v-bind="passwordAttrs"
              v-model="password"
              type="password"
              class="perfil-form__input"
              :class="{ 'form__input--error': errors.password }"
              :disabled="!isEditing"
              placeholder="Dejar vacío para no cambiar"
            />
            <span v-if="errors.password && isEditing" class="form__error-msg">{{ errors.password }}</span>
          </div>

          <div class="perfil-form__group" v-if="isEditing">
            <label class="perfil-form__label">Repetir contraseña</label>
            <input
              v-bind="confirmPasswordAttrs"
              v-model="confirmPassword"
              type="password"
              class="perfil-form__input"
              :class="{ 'form__input--error': errors.confirmPassword }"
              placeholder="Repite la nueva contraseña"
            />
            <span v-if="errors.confirmPassword" class="form__error-msg">{{ errors.confirmPassword }}</span>
          </div>
        </form>

        <span v-if="errorServidor" class="form__error-msg form__error-msg--center" style="margin-top:12px">
          {{ errorServidor }}
        </span>

      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

const authStore = useAuthStore()
const isEditing = ref(false)
const errorServidor = ref('')

// ── Foto de perfil ─────────────────────────────────────────────────────────────
const fotoInput = ref<HTMLInputElement | null>(null)
const subiendo  = ref(false)
const errorFoto = ref('')

function triggerFotoInput() {
  fotoInput.value?.click()
}

async function subirFoto(event: Event) {
  const input   = event.target as HTMLInputElement
  const archivo = input.files?.[0]
  if (!archivo) return

  subiendo.value  = true
  errorFoto.value = ''

  try {
    const formData = new FormData()
    formData.append('archivo', archivo)

    const id       = authStore.usuario?.idUsuario
    const response = await fetch(`/api/Usuario/${id}/foto`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.mensaje ?? 'Error al subir la foto.')
    }

    const data = await response.json()

    if (authStore.usuario) {
      authStore.usuario.fotoPerfil = data.fotoPerfil
    }
  } catch (err: any) {
    errorFoto.value = err.message ?? 'Error desconocido.'
  } finally {
    subiendo.value = false
    if (fotoInput.value) fotoInput.value.value = ''
  }
}

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Introduce un correo válido'),
  password: yup
    .string()
    .test('min-si-relleno', 'La contraseña debe tener al menos 8 caracteres', value => {
      if (!value) return true
      return value.length >= 8
    }),
  confirmPassword: yup
    .string()
    .test('coincide', 'Las contraseñas no coinciden', function (value) {
      const { password } = this.parent
      if (!password) return true
      return value === password
    })
})

// ── Form ──────────────────────────────────────────────────────────────────────
const { errors, handleSubmit, defineField, setValues } = useForm({ validationSchema: schema })

const [nombre, nombreAttrs]                   = defineField('nombre')
const [email, emailAttrs]                     = defineField('email')
const [password, passwordAttrs]               = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

onMounted(() => {
  setValues({
    nombre: authStore.usuario?.nombre ?? '',
    email: authStore.usuario?.email ?? '',
    password: '',
    confirmPassword: ''
  })
})

// ── Toggle edición / guardar ──────────────────────────────────────────────────
const toggleEdit = handleSubmit(async (values) => {
  if (!isEditing.value) {
    isEditing.value = true
    return
  }

  errorServidor.value = ''

  try {
    let contraseñaFinal = values.password
    if (!contraseñaFinal) {
      const usuarioActual = await api.get<{ contraseña: string }>(`/Usuario/${authStore.usuario?.idUsuario}`)
      contraseñaFinal = usuarioActual.contraseña
    }

    await api.put(`/Usuario/${authStore.usuario?.idUsuario}`, {
      idUsuario: authStore.usuario?.idUsuario,
      nombre: values.nombre,
      email: values.email,
      contraseña: contraseñaFinal,
      rol: authStore.usuario?.rol
    })

    authStore.setUsuario({
      idUsuario: authStore.usuario!.idUsuario,
      nombre: values.nombre!,
      email: values.email!,
      rol: authStore.usuario!.rol,
      fotoPerfil: authStore.usuario!.fotoPerfil
    })

    setValues({ ...values, password: '', confirmPassword: '' })
    isEditing.value = false
  } catch (err) {
    errorServidor.value = err instanceof Error ? err.message : 'Error al guardar los cambios.'
  }
})
</script>

<style scoped>
.perfil-user__avatar {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  margin: 0 auto 0.5rem;
}

.perfil-user__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: filter 0.2s ease;
}

.perfil-user__avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 1.5rem;
}

.perfil-user__avatar:hover .perfil-user__avatar-overlay {
  opacity: 1;
}

.perfil-user__avatar:hover .perfil-user__img {
  filter: brightness(0.75);
}

.perfil-user__foto-estado {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.perfil-user__foto-error {
  font-size: 0.85rem;
  color: #dc2626;
  margin: 0.25rem 0;
}
</style>