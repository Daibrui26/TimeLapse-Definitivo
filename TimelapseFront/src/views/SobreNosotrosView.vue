<template>
  <div class="page">
    <AppHeader variant="app" />

    <main class="page__main page__main--sobre">

      <div class="amigos-titulo">
        <h1 class="perfil-header__title">Sobre Nosotros</h1>
      </div>

      <section class="card sobre-card">

        <!-- Intro destacada -->
        <div class="sobre-intro">
          <span class="sobre-intro__icono">⏳</span>
          <p class="sobre-intro__texto">
            En <strong>Timelapse</strong> creemos que el tiempo tiene un valor especial. Los recuerdos,
            las experiencias y las reflexiones que vivimos hoy pueden adquirir un significado
            completamente distinto en el futuro. Por eso hemos creado una plataforma que permite
            a las personas guardar momentos, pensamientos y mensajes para descubrirlos en el
            momento adecuado.
          </p>
        </div>

        <hr class="sobre-divider" />

        <!-- Bloque: qué es -->
        <div class="sobre-bloque">
          <div class="sobre-bloque__cabecera">
            <span class="sobre-bloque__icono">💡</span>
            <h2 class="sobre-bloque__titulo">¿Qué es Timelapse?</h2>
          </div>
          <p class="sobre-bloque__texto">
            Timelapse nace como un proyecto tecnológico que combina innovación digital con una
            idea muy humana: conectar el presente con el futuro. Nuestra plataforma permite a
            los usuarios crear <strong>cápsulas del tiempo digitales</strong> donde pueden
            almacenar textos, imágenes o vídeos y programar cuándo quieren volver a verlos.
          </p>
        </div>

        <hr class="sobre-divider" />

        <!-- Bloque: objetivo -->
        <div class="sobre-bloque">
          <div class="sobre-bloque__cabecera">
            <span class="sobre-bloque__icono">🎯</span>
            <h2 class="sobre-bloque__titulo">Nuestro objetivo</h2>
          </div>
          <p class="sobre-bloque__texto">
            Ofrecer un espacio seguro, privado y sencillo donde cada persona pueda conservar
            partes importantes de su vida digital. No se trata solo de guardar información,
            sino de crear experiencias que puedan ser redescubiertas con el paso del tiempo.
          </p>
        </div>

        <hr class="sobre-divider" />

        <!-- Bloque: equipo -->
        <div class="sobre-bloque">
          <div class="sobre-bloque__cabecera">
            <span class="sobre-bloque__icono">👥</span>
            <h2 class="sobre-bloque__titulo">Nuestro equipo</h2>
          </div>
          <p class="sobre-bloque__texto">
            Detrás de Timelapse hay un equipo de jóvenes desarrolladores y emprendedores
            apasionados por la tecnología y la creación de productos digitales útiles.
            Trabajamos con la idea de que la tecnología no solo debe resolver problemas,
            sino también <strong>generar valor emocional</strong> y experiencias significativas
            para las personas.
          </p>
        </div>

        <hr class="sobre-divider" />

        <!-- Bloque: futuro -->
        <div class="sobre-bloque">
          <div class="sobre-bloque__cabecera">
            <span class="sobre-bloque__icono">🚀</span>
            <h2 class="sobre-bloque__titulo">Mirando al futuro</h2>
          </div>
          <p class="sobre-bloque__texto">
            Miramos al futuro con la intención de seguir mejorando nuestra plataforma,
            incorporar nuevas funcionalidades y llegar a una comunidad cada vez mayor de
            usuarios que quieran guardar hoy aquello que su
            <em>"yo del futuro"</em> agradecerá recordar.
          </p>
        </div>

        <hr class="sobre-divider" />

        <!-- CTA contacto -->
        <div class="sobre-contacto">
          <p class="sobre-contacto__texto">¿Tienes alguna pregunta o propuesta?</p>
          <a href="mailto:soporte@timelapse.com" class="sobre-contacto__btn">
            📧 soporte@timelapse.com
          </a>
        </div>

      </section>
    </main>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>

<style scoped>
.page__main--sobre {
  max-width: 650px !important;
}

.sobre-card {
  padding: 35px 35px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Intro ── */
.sobre-intro {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 24px;
}

.sobre-intro__icono {
  font-size: 32px;
  flex-shrink: 0;
  line-height: 1.4;
}

.sobre-intro__texto {
  color: #3A4156;
  font-size: 15px;
  line-height: 1.75;
}

/* ── Bloques ── */
.sobre-bloque {
  padding: 22px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sobre-bloque__cabecera {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}

.sobre-bloque__icono {
  font-size: 20px;
  flex-shrink: 0;
}

.sobre-bloque__titulo {
  color: #183263;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.sobre-bloque__texto {
  color: #3A4156;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  padding-left: 30px;
}

/* ── Divisor ── */
.sobre-divider {
  border: none;
  border-top: 1px solid #eeeeee;
  margin: 0;
}

/* ── Contacto ── */
.sobre-contacto {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.sobre-contacto__texto {
  color: #697C9F;
  font-size: 14px;
  margin: 0;
}

.sobre-contacto__btn {
  background: #183263;
  color: #fff;
  text-decoration: none;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
}

.sobre-contacto__btn:hover {
  background: #0f1f3d;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .sobre-card {
    padding: 25px 20px;
  }
  .sobre-bloque__texto {
    padding-left: 0;
  }
}
</style>
