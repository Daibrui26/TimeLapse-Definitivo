<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--perfil">

      <p v-if="loading" style="text-align:center; color:#697C9F; padding: 40px 0">Cargando perfil...</p>
      <p v-else-if="error" style="text-align:center; color:#C85C5C; padding: 40px 0">{{ error }}</p>

      <template v-else-if="amigo">

        <!-- Cabecera del perfil -->
        <section class="card card--perfil" style="width:100%">
          <div class="perfil-user">
            <div class="perfil-user__avatar">
              <img src="@/assets/img/Perfil.png" alt="Usuario" class="perfil-user__img" />
            </div>
            <h2 class="perfil-user__name">{{ amigo.nombre }}</h2>
          </div>
        </section>

        <!-- Cápsulas públicas -->
        <section class="card" style="width:100%; text-align:left; padding: 25px 30px">
          <h2 class="capsula-seccion__titulo" style="margin-bottom:15px">
            Cápsulas
            <span style="font-weight:400; color:#aaa; font-size:13px; margin-left:8px">
              ({{ capsulasPúblicas.length }})
            </span>
          </h2>

          <p v-if="loadingCapsulas" style="color:#999; font-size:13px; font-style:italic">
            Cargando cápsulas...
          </p>

          <div v-else-if="capsulasPúblicas.length === 0" class="capsulas-empty" style="box-shadow:none; padding:20px 0">
            <p class="capsulas-empty__text" style="font-size:15px">Este usuario no tiene cápsulas</p>
          </div>

          <div v-else class="capsulas-list">
            <CapsuleItem
              v-for="capsula in capsulasPúblicas"
              :key="capsula.idCapsula"
              :title="capsula.titulo"
              :date="capsula.fechaApertura"
              :to="`/capsula/${capsula.idCapsula}`"
              emoji="⏳"
            />
          </div>
        </section>

      </template>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import CapsuleItem from '@/components/CapsuleItem.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface Usuario {
  idUsuario: number
  nombre: string
  email: string
}

interface Capsula {
  idCapsula: number
  titulo: string
  fechaApertura: string
  visibilidad: string
}

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const amigo          = ref<Usuario | null>(null)
const capsulas       = ref<Capsula[]>([])
const loading        = ref(true)
const loadingCapsulas = ref(true)
const error          = ref('')

const capsulasPúblicas = computed(() =>
  capsulas.value.filter(c => c.visibilidad === 'publica')
)

onMounted(async () => {
  const id = Number(route.params.id)

  // Redirigir si intenta ver su propio perfil
  if (id === authStore.usuario?.idUsuario) {
    router.replace('/perfil')
    return
  }

  try {
    amigo.value = await api.get<Usuario>(`/Usuario/${id}`)
  } catch {
    error.value = 'No se pudo cargar el perfil de este usuario.'
  } finally {
    loading.value = false
  }

  try {
    capsulas.value = await api.get<Capsula[]>(`/Capsula/usuario/${id}`)
  } catch {
    // Si falla no mostramos cápsulas
  } finally {
    loadingCapsulas.value = false
  }
})
</script>