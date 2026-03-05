<template>
  <div class="page">
    <AppHeader variant="public" logo-link="/" />

    <main class="page__main">
      <section class="card card--form">
        <h1 class="card__title card__title--main">CREAR CUENTA</h1>
        <p class="card__subtitle card__subtitle--main">
          Únete a Timelapse y comienza a guardar tus recuerdos.
        </p>

        <form class="form" @submit.prevent="handleRegister">
          <div class="form__group">
            <label for="nombre" class="form__label">Nombre completo</label>
            <input
              v-bind="nombreAttrs"
              v-model="nombre"
              type="text"
              id="nombre"
              class="form__input"
              :class="{ 'form__input--error': errors.nombre }"
              placeholder="Ej: Juan Pérez"
            />
            <span v-if="errors.nombre" class="form__error-msg">{{ errors.nombre }}</span>
          </div>

          <div class="form__group">
            <label for="email" class="form__label">Correo electrónico</label>
            <input
              v-bind="emailAttrs"
              v-model="email"
              type="email"
              id="email"
              class="form__input"
              :class="{ 'form__input--error': errors.email }"
              placeholder="ejemplo@correo.com"
            />
            <span v-if="errors.email" class="form__error-msg">{{ errors.email }}</span>
          </div>

          <div class="form__group">
            <label for="password" class="form__label">Contraseña</label>
            <input
              v-bind="passwordAttrs"
              v-model="password"
              type="password"
              id="password"
              class="form__input"
              :class="{ 'form__input--error': errors.password }"
              placeholder="Mínimo 8 caracteres"
            />
            <span v-if="errors.password" class="form__error-msg">{{ errors.password }}</span>
          </div>

          <div class="form__group">
            <label for="confirmPassword" class="form__label">Confirmar contraseña</label>
            <input
              v-bind="confirmPasswordAttrs"
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              class="form__input"
              :class="{ 'form__input--error': errors.confirmPassword }"
              placeholder="Repite tu contraseña"
            />
            <span v-if="errors.confirmPassword" class="form__error-msg">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form__group">
            <label for="fechaNac" class="form__label">Fecha de nacimiento</label>
            <input
              v-bind="fechaNacAttrs"
              v-model="fechaNac"
              type="date"
              id="fechaNac"
              class="form__input"
              :class="{ 'form__input--error': errors.fechaNac }"
            />
            <span v-if="errors.fechaNac" class="form__error-msg">{{ errors.fechaNac }}</span>
          </div>

          <hr class="form__separator" />

          <span v-if="errorServidor" class="form__error-msg form__error-msg--center">
            {{ errorServidor }}
          </span>

          <button type="submit" class="btn btn--submit" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
          <RouterLink to="/" class="btn btn--cancel">Cancelar</RouterLink>
        </form>

        <p class="welcome__text" style="margin-top: 20px">
          ¿Ya tienes cuenta?
          <RouterLink to="/iniciar-sesion" class="link">Inicia sesión</RouterLink>
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authservice'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorServidor = ref('')

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
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  fechaNac: yup
    .string()
    .required('La fecha de nacimiento es obligatoria')
    .test('mayor-de-edad', 'Debes tener al menos 13 años', value => {
      if (!value) return false
      const nacimiento = new Date(value)
      const hoy = new Date()
      const edad = hoy.getFullYear() - nacimiento.getFullYear()
      return edad >= 13
    })
})

// ── Form ──────────────────────────────────────────────────────────────────────
const { errors, handleSubmit, defineField } = useForm({ validationSchema: schema })

const [nombre, nombreAttrs]                   = defineField('nombre')
const [email, emailAttrs]                     = defineField('email')
const [password, passwordAttrs]               = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')
const [fechaNac, fechaNacAttrs]               = defineField('fechaNac')

// ── Submit ────────────────────────────────────────────────────────────────────
const handleRegister = handleSubmit(async (values) => {
  errorServidor.value = ''
  loading.value = true

  try {
    const response = await authService.register({
      nombre: values.nombre,
      email: values.email,
      contraseña: values.password
    })

    authStore.setUsuario({
      idUsuario: response.idUsuario,
      nombre: response.nombre,
      email: response.email,
      rol: response.rol ?? 'usuario'
    })

    router.push('/home')
  } catch (err: unknown) {
    errorServidor.value = err instanceof Error ? err.message : 'Error al registrarse'
  } finally {
    loading.value = false
  }
})
</script>