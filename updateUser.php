<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
$host = 'localhost';
$dbname = 'ecommerce';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_GET['user_id'] ?? null;
    $inputData = file_get_contents("php://input");
    $data = json_decode($inputData, true);

    // Debugging - Check received data
    file_put_contents('php://stderr', print_r([
        "user_id" => $userId,
        "received_data" => $data
    ], true));

    if (
        $userId &&
        isset($data['username']) &&
        isset($data['email']) &&
        isset($data['first_name']) &&
        isset($data['last_name'])
    ) {
        $username = $data['username'];
        $email = $data['email'];
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];

        try {
            $sql = "UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ? WHERE user_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$username, $email, $first_name, $last_name, $userId]);

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(["message" => "User updated successfully"]);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "No changes made"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database error: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid input data", "data_received" => $data]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method. Use POST."]);
}
?>
