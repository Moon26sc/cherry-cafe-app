<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/Database.php';
$db = (new Database())->getConnection();

$id_cliente = isset($_GET['id_cliente']) ? $_GET['id_cliente'] : die(json_encode(["mensaje" => "Falta el ID del cliente"]));

try {
    $query = "SELECT id_pedido, fecha, estado, tipo_entrega, total 
              FROM pedidos WHERE id_cliente = :id_cliente ORDER BY fecha DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id_cliente', $id_cliente);
    $stmt->execute();

    $pedidos = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $id_pedido = $row['id_pedido'];

        $query_items = "SELECT ip.cantidad, ip.precio_unitario, ip.subtotal, p.nombre 
                        FROM items_pedido ip 
                        INNER JOIN productos p ON ip.id_producto = p.id_producto 
                        WHERE ip.id_pedido = :id_pedido";
        $stmt_items = $db->prepare($query_items);
        $stmt_items->bindParam(':id_pedido', $id_pedido);
        $stmt_items->execute();

        $row['items'] = $stmt_items->fetchAll(PDO::FETCH_ASSOC);

        array_push($pedidos, $row);
    }

    echo json_encode($pedidos);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error SQL: " . $e->getMessage()]);
}
