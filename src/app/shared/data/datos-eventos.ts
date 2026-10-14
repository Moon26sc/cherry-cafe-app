export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  categoria: string;
  precio: number;
  cupos: number;
  imagen: string;
}

export const EVENTOS: Evento[] = [
  { id: 1, nombre: 'Taller de Latte Art', descripcion: 'Aprende a dibujar en la espuma con nuestros baristas.', fecha: '2026-10-24', categoria: 'Taller', precio: 45, cupos: 8, imagen: 'assets/img/latte.jpg' },
  { id: 2, nombre: 'Cata de Café de Origen', descripcion: 'Prueba tres granos de especialidad peruanos.', fecha: '2026-11-07', categoria: 'Cata', precio: 35, cupos: 12, imagen: 'assets/img/espresso.jpg' },
  { id: 3, nombre: 'Noche de Postres', descripcion: 'Brownies, cheesecake y alfajores con café ilimitado.', fecha: '2026-11-14', categoria: 'Degustación', precio: 50, cupos: 0, imagen: 'assets/img/Cheesecake.jpg' },
  { id: 4, nombre: 'Tarde de Lectura', descripcion: 'Trae tu libro favorito y disfruta un chai latte.', fecha: '2026-11-28', categoria: 'Comunidad', precio: 20, cupos: 15, imagen: 'assets/img/chailate.jpeg' }
];