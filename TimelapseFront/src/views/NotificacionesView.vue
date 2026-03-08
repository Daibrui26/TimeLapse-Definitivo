<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--capsulas">

      <div class="amigos-titulo">
        <h1 class="perfil-header__title">
          Notificaciones
          <span
            v-if="store.noLeidas > 0"
            style="
              background:#C85C5C; color:#fff;
              font-size:12px; font-weight:700;
              padding:2px 9px; border-radius:20px;
              margin-left:8px; vertical-align:middle;
            "
          >{{ store.noLeidas }}</span>
        </h1>
      </div>

      <p v-if="store.cargando" style="text-align:center; color:#697C9F; padding:30px 0">
        Cargando notificaciones...
      </p>

      <div v-else-if="store.notificaciones.length === 0" class="capsulas-empty">
        <p style="font-size:32px">🔔</p>
        <p class="capsulas-empty__text" style="font-size:15px">
          No tienes notificaciones.
        </p>
      </div>

      <section v-else class="capsulas-list">
        <div
          v-for="notif in store.notificaciones"
          :key="notif.idNotificacion"
          class="notif-card"
          :class="{ 'notif-card--leida': notif.leida }"
        >
          <span class="notif-card__icono">{{ iconoTipo(notif.tipo) }}</span>

          <div class="notif-card__contenido">
            <p class="notif-card__mensaje">{{ notif.mensaje }}</p>
            <p class="notif-card__fecha">{{ formatFecha(notif.fechaCreacion) }}</p>

            <div
              v-if="notif.tipo === 'solicitud_amistad' && !notif.leida"
              class="notif-card__acciones"
            >
              <button
                class="notif-card__btn notif-card__btn--aceptar"
                :disabled="procesando === notif.idNotificacion"
                @click="aceptarSolicitud(notif)"
              >
                {{ procesando === notif.idNotificacion ? '...' : '✓ Aceptar' }}
              </button>
              <button
                class="notif-card__btn notif-card__btn--rechazar"
                :disabled="procesando === notif.idNotificacion"
                @click="rechazarSolicitud(notif)"
              >
                {{ procesando === notif.idNotificacion ? '...' : '✕ Rechazar' }}
              </button>
            </div>

            <p
              v-else-if="notif.tipo === 'solicitud_amistad' && notif.leida"
              style="font-size:12px; color:#aaa; margin-top:4px; font-style:italic"
            >
              Solicitud ya gestionada
            </p>
          </div>

          <span v-if="!notif.leida" class="notif-card__punto" />
        </div>
      </section>

      <button
        v-if="store.notificaciones.some(n => n.leida)"
        class="btn-limpiar"
        style="margin-top:8px"
        @click="limpiarLeidas"
      >
        🗑 Limpiar notificaciones leídas
      </button>

    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useNotificacionesStore } from '@/stores/notificaciones'
import { useToast } from '@/composables/useToast'
import type { Notificacion } from '@/services/notificacionesService'
import type { Amistad } from '@/services/amigosService'

const authStore = useAuthStore()
const store     = useNotificacionesStore()
const toast     = useToast()

const procesando = ref<number | null>(null)

onMounted(() => store.cargar())

onUnmounted(async () => {
  const noInteractivas = store.notificaciones.filter(
    n => !n.leida && n.tipo !== 'solicitud_amistad'
  )
  await Promise.all(noInteractivas.map(n => store.marcarLeida(n)))
})

// ── Aceptar solicitud ─────────────────────────────────────────────────────────
async function aceptarSolicitud(notif: Notificacion) {
  procesando.value = notif.idNotificacion
  try {
    const amistades = await api.get<Amistad[]>('/Amistad')
    const amistad = amistades.find(
      a => a.idUsuario2 === authStore.usuario?.idUsuario && a.estado === 'pendiente'
    )

    if (!amistad) {
      toast.error('No se encontró la solicitud. Puede que ya haya sido gestionada.')
      await store.marcarLeida(notif)
      return
    }

    await api.put(`/Amistad/${amistad.idAmistad}`, { ...amistad, estado: 'aceptada' })

    await api.post('/Notificacion', {
      tipo: 'solicitud_aceptada',
      mensaje: `${authStore.usuario?.nombre} ha aceptado tu solicitud de amistad.`,
      fechaCreacion: new Date().toISOString(),
      leida: false,
      idUsuario: amistad.idUsuario1,
      idCapsula: null
    })

    await store.marcarLeida(notif)
    toast.success('¡Solicitud aceptada! Ahora sois amigos.')
  } catch (e: any) {
    toast.error(e?.message || 'Error al aceptar la solicitud.')
  } finally {
    procesando.value = null
  }
}

// ── Rechazar solicitud ────────────────────────────────────────────────────────
async function rechazarSolicitud(notif: Notificacion) {
  procesando.value = notif.idNotificacion
  try {
    const amistades = await api.get<Amistad[]>('/Amistad')
    const amistad = amistades.find(
      a => a.idUsuario2 === authStore.usuario?.idUsuario && a.estado === 'pendiente'
    )
    if (amistad) await api.delete(`/Amistad/${amistad.idAmistad}`)

    await store.marcarLeida(notif)
    toast.info('Solicitud rechazada.')
  } catch (e: any) {
    toast.error(e?.message || 'Error al rechazar la solicitud.')
  } finally {
    procesando.value = null
  }
}

// ── Limpiar leídas ────────────────────────────────────────────────────────────
async function limpiarLeidas() {
  try {
    await store.limpiarLeidas()
    toast.success('Notificaciones leídas eliminadas.')
  } catch {
    toast.error('Error al limpiar las notificaciones.')
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function iconoTipo(tipo: string): string {
  if (tipo === 'solicitud_amistad')  return '👤'
  if (tipo === 'solicitud_aceptada') return '✅'
  if (tipo === 'alerta')             return '⚠️'
  return '🔔'
}

function formatFecha(fecha: string): string {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}
</script>

<style scoped>
.notif-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  position: relative;
  transition: opacity 0.2s;
  width: 100%;
}

.notif-card--leida {
  opacity: 0.6;
}

.notif-card__icono {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notif-card__contenido {
  flex: 1;
  text-align: left;
}

.notif-card__mensaje {
  color: #183263;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notif-card__fecha {
  color: #aaa;
  font-size: 12px;
  margin-bottom: 10px;
}

.notif-card__acciones {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.notif-card__btn {
  border: none;
  border-radius: 20px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.notif-card__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.notif-card__btn--aceptar {
  background: #183263;
  color: #fff;
}
.notif-card__btn--aceptar:hover:not(:disabled) {
  background: #0f1f3d;
}

.notif-card__btn--rechazar {
  background: #fde8e8;
  color: #C85C5C;
}
.notif-card__btn--rechazar:hover:not(:disabled) {
  background: #C85C5C;
  color: #fff;
}

.notif-card__punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #C85C5C;
  flex-shrink: 0;
  margin-top: 4px;
}

.btn-limpiar {
  background: #C85C5C;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-limpiar:hover {
  background: #a84444;
}
</style>