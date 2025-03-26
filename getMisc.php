<?php
// Fetch departments
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['endpoint'] === 'api/departments') {
    $sql = "SELECT department_id, name FROM departments";
    $result = $conn->query($sql);

    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }

    echo json_encode($departments);
}

// Fetch modules
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['endpoint'] === 'api/modules') {
    $sql = "SELECT id, name FROM modules";
    $result = $conn->query($sql);

    $modules = [];
    while ($row = $result->fetch_assoc()) {
        $modules[] = $row;
    }

    echo json_encode($modules);
}

// Fetch categories
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['endpoint'] === 'api/categories') {
    $sql = "SELECT category_id, name FROM categories";
    $result = $conn->query($sql);

    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    echo json_encode($categories);
}

// Save user role
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['endpoint'] === 'api/save-role') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user = $data['user'];
    $department = $data['department'];
    $modules = $data['modules'];
    $categories = $data['categories'];

    $roleQuery = "INSERT INTO user_roles (id, department_id) VALUES ('$user', '$department')";
    if ($conn->query($roleQuery)) {
        $roleId = $conn->insert_id;

        foreach ($modules as $module) {
            $conn->query("INSERT INTO role_modules (id, module_id) VALUES ('$roleId', '$module')");
        }

        foreach ($categories as $category) {
            $conn->query("INSERT INTO role_categories (id, category_id) VALUES ('$roleId', '$category')");
        }

        echo json_encode(["message" => "Role saved successfully!"]);
    } else {
        echo json_encode(["error" => "Failed to save user role."]);
    }
}

// Add a new user
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['endpoint'] === 'api/add-user') {
    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'];
    $password = $data['password'];
    $email = $data['email'];
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $address1 = $data['address1'];
    $address2 = $data['address2'];
    $city = $data['city'];
    $province = $data['province'];
    $country = $data['country'];
    $postalCode = $data['postalCode'];

    $userQuery = "INSERT INTO users (username, password, email, first_name, last_name) VALUES ('$username', '$password', '$email', '$firstName', '$lastName')";

    if ($conn->query($userQuery)) {
        $userId = $conn->insert_id;
        $addressQuery = "INSERT INTO user_address (user_id, address1, address2, city, province, country, postal_code) 
                         VALUES ('$userId', '$address1', '$address2', '$city', '$province', '$country', '$postalCode')";

        if ($conn->query($addressQuery)) {
            echo json_encode(["message" => "User and address added successfully!"]);
        } else {
            echo json_encode(["error" => "Failed to add user address."]);
        }
    } else {
        echo json_encode(["error" => "Failed to add user."]);
    }
}

// Get all products
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['endpoint'] === 'products') {
    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);
}

// delete  User
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['endpoint'] === 'deleteUser') {
    $userId = $data['userId'];

    // Prepare and execute the DELETE query
    $stmt = $connection->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete user"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "User ID not provided"]);
}
$conn->close();


?>