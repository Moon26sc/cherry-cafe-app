<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/Database.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->items) || empty($data->total)) {
    http_response_code(400);
    echo json_encode(["mensaje" => "Datos del pedido incompletos."]);
    exit();
}

try {
    $db->beginTransaction();

    $query_pedido = "INSERT INTO pedidos (id_cliente, estado, tipo_entrega, total) 
                     VALUES (:id_cliente, 'PENDIENTE', :tipo_entrega, :total) RETURNING id_pedido";
    
    $stmt_pedido = $db->prepare($query_pedido);
    
    $id_cliente = isset($data->id_cliente) ? $data->id_cliente : null;
    $tipo_entrega = isset($data->tipo_entrega) ? $data->tipo_entrega : 'TIENDA';

    $stmt_pedido->bindParam(':id_cliente', $id_cliente);
    $stmt_pedido->bindParam(':tipo_entrega', $tipo_entrega);
    $stmt_pedido->bindParam(':total', $data->total);
    $stmt_pedido->execute();
    
    $row = $stmt_pedido->fetch(PDO::FETCH_ASSOC);
    $id_pedido_generado = $row['id_pedido'];

    $query_item = "INSERT INTO items_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) 
                   VALUES (:id_pedido, :id_producto, :cantidad, :precio_unitario, :subtotal)";
    $stmt_item = $db->prepare($query_item);

    foreach ($data->items as $item) {
        $subtotal = $item->cantidad * $item->precio;
        
        $stmt_item->bindParam(':id_pedido', $id_pedido_generado);
        $stmt_item->bindParam(':id_producto', $item->id_producto);
        $stmt_item->bindParam(':cantidad', $item->cantidad);
        $stmt_item->bindParam(':precio_unitario', $item->precio);
        $stmt_item->bindParam(':subtotal', $subtotal);
        $stmt_item->execute();
    }

    $query_pago = "INSERT INTO pagos (id_pedido, monto, metodo, estado) 
                   VALUES (:id_pedido, :monto, :metodo, 'COMPLETADO')";
    $stmt_pago = $db->prepare($query_pago);
    
    $metodo_pago = isset($data->metodo_pago) ? $data->metodo_pago : 'TARJETA';
    
    $stmt_pago->bindParam(':id_pedido', $id_pedido_generado);
    $stmt_pago->bindParam(':monto', $data->total);
    $stmt_pago->bindParam(':metodo', $metodo_pago);
    $stmt_pago->execute();

    if ($id_cliente != null) {
        $puntos_ganados = floor($data->total); 
        $query_puntos = "UPDATE clientes SET puntos_fidelidad = puntos_fidelidad + :puntos WHERE id_usuario = :id_cliente";
        $stmt_puntos = $db->prepare($query_puntos);
        $stmt_puntos->bindParam(':puntos', $puntos_ganados);
        $stmt_puntos->bindParam(':id_cliente', $id_cliente);
        $stmt_puntos->execute();
    }

    $db->commit();
    
    http_response_code(201);
    echo json_encode(["mensaje" => "Pedido procesado exitosamente.", "id_pedido" => $id_pedido_generado]);

} catch(PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al procesar el pedido: " . $e->getMessage()]);
}
?>