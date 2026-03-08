using TimelapseAPI.Models;
using TimelapseAPI.Models.DTOs;
using TimelapseAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TimelapseAPI.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IUploadService _uploadService;

        public UsuarioService(IUsuarioRepository usuarioRepository, IUploadService uploadService)
        {
            _usuarioRepository = usuarioRepository;
            _uploadService     = uploadService;
        }

        public async Task<List<Usuario>> GetAllAsync()
        {
            return await _usuarioRepository.GetAllAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("El ID debe ser mayor que cero.");

            return await _usuarioRepository.GetByIdAsync(id);
        }

        public async Task<List<Usuario>> GetAllFilteredAsync(string? nombre, string? email, string? orderBy, bool ascending)
        {
            return await _usuarioRepository.GetAllFilteredAsync(nombre, email, orderBy, ascending);
        }

        public async Task AddAsync(Usuario usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Nombre))
                throw new ArgumentException("El nombre del usuario no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(usuario.Email))
                throw new ArgumentException("El email del usuario no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(usuario.Contraseña))
                throw new ArgumentException("La contraseña del usuario no puede estar vacía.");

            await _usuarioRepository.CreateAsync(usuario);
        }

        public async Task UpdateAsync(Usuario usuario)
        {
            if (usuario.IdUsuario <= 0)
                throw new ArgumentException("El ID no es válido para actualización.");

            if (string.IsNullOrWhiteSpace(usuario.Nombre))
                throw new ArgumentException("El nombre del usuario no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(usuario.Email))
                throw new ArgumentException("El email del usuario no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(usuario.Contraseña))
                throw new ArgumentException("La contraseña del usuario no puede estar vacía.");

            var updated = await _usuarioRepository.UpdateAsync(usuario);
            if (updated == null)
                throw new KeyNotFoundException("Usuario no encontrado para actualizar.");
        }

        public async Task DeleteAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException("El ID no es válido para eliminación.");

            var deleted = await _usuarioRepository.DeleteAsync(id);
            if (!deleted)
                throw new KeyNotFoundException("Usuario no encontrado para eliminar.");
        }

        // LOGIN: busca por email y compara contraseña en texto plano
        public async Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Contraseña))
                throw new ArgumentException("Email y contraseña son obligatorios.");

            var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);

            if (usuario == null || usuario.Contraseña != request.Contraseña)
                return null;

            return new LoginResponseDTO
            {
                IdUsuario  = usuario.IdUsuario,
                Nombre     = usuario.Nombre,
                Email      = usuario.Email,
                Rol        = usuario.Rol,
                FotoPerfil = usuario.FotoPerfil
            };
        }

        // SUBIR / ACTUALIZAR FOTO DE PERFIL
        public async Task<string> ActualizarFotoAsync(int idUsuario, IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                throw new ArgumentException("El archivo está vacío.");

            var usuario = await _usuarioRepository.GetByIdAsync(idUsuario)
                ?? throw new ArgumentException("Usuario no encontrado.");

            // Borrar foto anterior de Cloudinary si existe
            if (!string.IsNullOrEmpty(usuario.FotoPerfilPublicId))
                await _uploadService.DeleteAsync(usuario.FotoPerfilPublicId);

            // Subir nueva foto
            var url      = await _uploadService.UploadAsync(archivo);
            var publicId = ExtractPublicId(url);

            usuario.FotoPerfil         = url;
            usuario.FotoPerfilPublicId = publicId;

            await _usuarioRepository.UpdateAsync(usuario);

            return url;
        }

        // Extrae el public_id de una URL de Cloudinary
        // Ejemplo: https://res.cloudinary.com/xxx/image/upload/v123/timelapse/imagenes/abc.jpg
        //          → timelapse/imagenes/abc
        private static string ExtractPublicId(string url)
        {
            try
            {
                var uri      = new Uri(url);
                var segments = uri.AbsolutePath.Split('/');
                var idx      = Array.IndexOf(segments, "upload");
                if (idx < 0) return url;

                // Saltar "upload" y el segmento de versión (vXXXXXX)
                var pathParts    = segments.Skip(idx + 2).ToArray();
                var joined       = string.Join("/", pathParts);
                var dotIdx       = joined.LastIndexOf('.');
                return dotIdx >= 0 ? joined[..dotIdx] : joined;
            }
            catch
            {
                return url;
            }
        }
    }
}