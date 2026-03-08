namespace TimelapseAPI.Models
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Contraseña { get; set; } = string.Empty;
        public string Rol { get; set; } = "usuario";
        public string? FotoPerfil { get; set; }
        public string? FotoPerfilPublicId { get; set; }
    }
}