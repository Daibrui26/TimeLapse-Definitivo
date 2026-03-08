<template>
  <div class="page">
    <AppHeader variant="public" logo-link="/" />

    <main class="page__main page__main--login">
      <section class="card card--login">
        <h1 class="login__title">BIENVENIDO A<br />TIMELAPSE</h1>
        <p class="login__subtitle">Inicia sesión para acceder a tus cápsulas del tiempo</p>

        <form class="form form--login" @submit.prevent="handleLogin">
          <div class="form__group">
            <label for="email" class="form__label">Correo electrónico</label>
            <input
              v-bind="emailAttrs"
              v-model="email"
              type="email"
              id="email"
              class="form__input"
              :class="{ 'form__input--error': errors.email }"
              placeholder="tu@email.com"
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
              placeholder="••••••••"
            />
            <span v-if="errors.password" class="form__error-msg">{{ errors.password }}</span>
          </div>

          <a href="#" class="login__forgot">¿Olvidaste tu contraseña?</a>

          <span v-if="errorServidor" class="form__error-msg form__error-msg--center">
            {{ errorServidor }}
          </span>

          <button type="submit" class="btn btn--submit btn--login" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Iniciar sesión' }}
          </button>
        </form>

        <div class="login__divider">
          <span class="login__divider-text">o</span>
        </div>

        <p class="login__register">
          ¿No tienes cuenta?
          <RouterLink to="/registro" class="link">Regístrate aquí</RouterLink>
        </p>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authservice'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorServidor = ref('')

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = yup.object({
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Introduce un correo válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

// ── Form ──────────────────────────────────────────────────────────────────────
const { errors, handleSubmit, defineField } = useForm({ validationSchema: schema })

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

// ── Submit ────────────────────────────────────────────────────────────────────
const handleLogin = handleSubmit(async (values) => {
  errorServidor.value = ''
  loading.value = true

  try {
    const response = await authService.login({
      email: values.email,
      contraseña: values.password
    })

    authStore.setUsuario({
      idUsuario: response.idUsuario,
      nombre: response.nombre,
      email: response.email,
      rol: response.rol,
      fotoPerfil: response.fotoPerfil ?? null   // ← incluir siempre
    })

    router.push('/home')
  } catch (err: unknown) {
    errorServidor.value = err instanceof Error ? err.message : 'Email o contraseña incorrectos'
  } finally {
    loading.value = false
  }
})
</script>