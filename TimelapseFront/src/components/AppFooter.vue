<template>
  <footer class="footer">
    <div class="footer__content">
      <nav class="footer__nav">
        <a href="#" class="footer__link">Sobre nosotros</a>
        <a href="#" class="footer__link">Política &amp; Privacidad</a>
        <RouterLink to="/contacto" class="footer__link">Contacto</RouterLink>
      </nav>
      <div class="footer__contact">
        <span class="footer__contact-text">+34 111 22 33 44</span>
        <span class="footer__contact-text">tlapse@gmail.com</span>
      </div>
      <nav class="footer__social">
        <a href="#" class="footer__social-link">TikTok</a>
        <a href="#" class="footer__social-link">X</a>
        <a href="#" class="footer__social-link">Facebook</a>
        <a href="#" class="footer__social-link">YouTube</a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>