<?php
// Enable CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow requests from your Vite app
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
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

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate received data
    if (
        isset($data['username']) && 
        isset($data['email']) && 
        isset($data['password']) && 
        isset($data['first_name']) && 
        isset($data['last_name'])
    ) {
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password']; // Hash the password
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];

        try {
            $sql = "INSERT INTO users (username, email, password_hash, first_name, last_name) 
                    VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$username, $email, $password, $first_name, $last_name]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(["message" => "User added successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to add user"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error adding user", "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid input data"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method. Use POST."]);
}
?>
