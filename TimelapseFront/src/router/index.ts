import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/IndexView.vue'),
    },
    {
      path: '/iniciar-sesion',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true }
    },
    {
      path: '/registro',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { public: true }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/menu',
      name: 'Menu',
      component: () => import('@/views/MenuView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tus-capsulas',
      name: 'TusCapsulas',
      component: () => import('@/views/TusCapsulaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/crear-capsula',
      name: 'CrearCapsula',
      component: () => import('@/views/CrearCapsulasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contacto',
      name: 'Contacto',
      component: () => import('@/views/ContactoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/amigos',
      name: 'Amigos',
      component: () => import('@/views/AmigosView.vue'),
      meta: { requiresAuth: true }
    },
    // ── Buscar usuarios ───────────────────────────────────────────────────────
    {
      path: '/buscar',
      name: 'Buscar',
      component: () => import('@/views/BuscarUsuariosView.vue'),
      meta: { requiresAuth: true }
    },
    // ── Notificaciones ────────────────────────────────────────────────────────
    {
      path: '/notificaciones',
      name: 'Notificaciones',
      component: () => import('@/views/NotificacionesView.vue'),
      meta: { requiresAuth: true }
    },
    // ── Perfil público de un amigo ────────────────────────────────────────────
    {
      path: '/amigos/:id',
      name: 'AmigoPerfil',
      component: () => import('@/views/AmigoPerfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/capsula/:id',
      name: 'CapsulaDetalle',
      component: () => import('@/views/CapsulaDetalleView.vue'),
      meta: { requiresAuth: true }
    },
    // ── Admin ─────────────────────────────────────────────────────────────────
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/usuarios'
        },
        {
          path: 'usuarios',
          name: 'AdminUsuarios',
          component: () => import('@/views/admin/AdminUsuariosView.vue'),
        },
        {
          path: 'capsulas',
          name: 'AdminCapsulas',
          component: () => import('@/views/admin/AdminCapsulaView.vue'),
        },
        {
          path: 'comentarios',
          name: 'AdminComentarios',
          component: () => import('@/views/admin/AdminComentariosView.vue'),
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'Login' }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'Home' }
  }

  if (to.meta.public && authStore.isLoggedIn) {
    return { name: 'Home' }
  }
})

export default router