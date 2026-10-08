<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/Database.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $query = "SELECT p.id_producto as id, p.nombre, p.descripcion, p.precio, p.tamanio, p.disponible, c.nombre as categoria 
                      FROM productos p LEFT JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY p.id_producto DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $productos = array();
            while ($row = $stmt->fetch()) {
                $row['id'] = (int) $row['id'];
                $row['precio'] = (float) $row['precio'];
                $row['disponible'] = (bool) $row['disponible'];
                $row['imagen'] = "assets/img/placeholder.jpg";
                array_push($productos, $row);
            }
            echo json_encode($productos);
            break;

        case 'POST':
            $query = "INSERT INTO productos (id_categoria, nombre, descripcion, precio, disponible, tipo) 
                      VALUES (1, :nombre, :descripcion, :precio, :disponible, 'Bebida')";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':nombre', $data->nombre);
            $stmt->bindParam(':descripcion', $data->descripcion);
            $stmt->bindParam(':precio', $data->precio);
            $disponible = $data->disponible ? 'true' : 'false';
            $stmt->bindParam(':disponible', $disponible);

            if ($stmt->execute()) {
                echo json_encode(["mensaje" => "Producto creado."]);
            }
            break;

        case 'PUT':
            $id = isset($_GET['id']) ? $_GET['id'] : die();
            $query = "UPDATE productos SET nombre = :nombre, descripcion = :descripcion, 
                      precio = :precio, disponible = :disponible WHERE id_producto = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':nombre', $data->nombre);
            $stmt->bindParam(':descripcion', $data->descripcion);
            $stmt->bindParam(':precio', $data->precio);
            $disponible = $data->disponible ? 'true' : 'false';
            $stmt->bindParam(':disponible', $disponible);
            $stmt->bindParam(':id', $id);

            if ($stmt->execute()) {
                echo json_encode(["mensaje" => "Producto actualizado."]);
            }
            break;

        case 'PATCH':
            $id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["mensaje" => "ID no proporcionado"]));

            $campos = [];
            $parametros = [':id' => $id];

            if (isset($data->nombre)) {
                $campos[] = "nombre = :nombre";
                $parametros[':nombre'] = $data->nombre;
            }
            if (isset($data->descripcion)) {
                $campos[] = "descripcion = :descripcion";
                $parametros[':descripcion'] = $data->descripcion;
            }
            if (isset($data->precio)) {
                $campos[] = "precio = :precio";
                $parametros[':precio'] = $data->precio;
            }
            if (isset($data->disponible)) {
                $campos[] = "disponible = :disponible";
                $parametros[':disponible'] = $data->disponible ? 'true' : 'false';
            }

            if (count($campos) > 0) {
                $query = "UPDATE productos SET " . implode(", ", $campos) . " WHERE id_producto = :id";
                $stmt = $db->prepare($query);

                if ($stmt->execute($parametros)) {
                    echo json_encode(["mensaje" => "Producto modificado parcialmente."]);
                }
            } else {
                echo json_encode(["mensaje" => "Ningún dato válido para actualizar."]);
            }
            break;

        case 'DELETE':
            $id = isset($_GET['id']) ? $_GET['id'] : die();
            $query = "DELETE FROM productos WHERE id_producto = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            if ($stmt->execute()) {
                echo json_encode(["mensaje" => "Producto eliminado."]);
            }
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["mensaje" => "Error SQL: " . $e->getMessage()]);
}
