export interface Usuario { id_usuario: number; nombre: string; email: string; rol: string; }
export interface ItemPedido { id_producto?: number; cantidad: number; precio: number; }
export interface Pedido { id_cliente: number | null; total: number; tipo_entrega: string; metodo_pago: string; items: ItemPedido[]; }