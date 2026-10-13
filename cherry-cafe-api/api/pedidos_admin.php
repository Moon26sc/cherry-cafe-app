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

try {
    // Obtenemos los últimos 15 pedidos, uniendo con la tabla usuarios para obtener el nombre
    $query = "SELECT p.id_pedido as id, u.nombre as cliente, p.total, p.estado 
              FROM pedidos p
              LEFT JOIN usuarios u ON p.id_cliente = u.id_usuario 
              ORDER BY p.fecha DESC 
              LIMIT 15";
              
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formateamos los datos para evitar nulos si la compra fue de un visitante sin cuenta
    foreach ($pedidos as &$pedido) {
        if ($pedido['cliente'] == null) {
            $pedido['cliente'] = 'Cliente Anónimo';
        }
        // Convertimos el total a numérico para que el toFixed() de Angular no falle
        $pedido['total'] = (float)$pedido['total']; 
    }

    echo json_encode($pedidos);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error SQL: " . $e->getMessage()]);
}
?>