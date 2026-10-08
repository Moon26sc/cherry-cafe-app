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

if (!isset($data->accion)) {
    http_response_code(400);
    echo json_encode(["mensaje" => "Acción no especificada (login o registro)."]);
    exit();
}

try {
    if ($data->accion === 'registro') {
        
        $check_query = "SELECT id_usuario FROM usuarios WHERE email = :email";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->bindParam(':email', $data->email);
        $check_stmt->execute();
        
        if ($check_stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["mensaje" => "El correo ya está registrado."]);
            exit();
        }

        $db->beginTransaction();

        $query_usr = "INSERT INTO usuarios (nombre, email, password, rol) 
                      VALUES (:nombre, :email, :password, 'CLIENTE') RETURNING id_usuario";
        $stmt_usr = $db->prepare($query_usr);
        $stmt_usr->bindParam(':nombre', $data->nombre);
        $stmt_usr->bindParam(':email', $data->email);
        
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        $stmt_usr->bindParam(':password', $password_hash);
        $stmt_usr->execute();
        
        $row = $stmt_usr->fetch(PDO::FETCH_ASSOC);
        $nuevo_id_usuario = $row['id_usuario'];

        $query_cli = "INSERT INTO clientes (id_usuario, puntos_fidelidad) VALUES (:id_usuario, 0)";
        $stmt_cli = $db->prepare($query_cli);
        $stmt_cli->bindParam(':id_usuario', $nuevo_id_usuario);
        $stmt_cli->execute();

        $db->commit();
        http_response_code(201);
        echo json_encode(["mensaje" => "Cuenta creada exitosamente."]);
    } 
    else if ($data->accion === 'login') {
        $query = "SELECT id_usuario, nombre, email, password, rol FROM usuarios WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($data->password, $usuario['password'])) {
                unset($usuario['password']); 
                http_response_code(200);
                echo json_encode([
                    "mensaje" => "Login exitoso",
                    "usuario" => $usuario
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["mensaje" => "Contraseña incorrecta."]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["mensaje" => "No existe una cuenta con ese correo."]);
        }
    }
} catch(PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack(); 
    }
    http_response_code(500);
    echo json_encode(["mensaje" => "Error interno: " . $e->getMessage()]);
}
?>