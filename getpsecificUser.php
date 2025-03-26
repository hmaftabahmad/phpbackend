<?php



// Fetch specific users with select fields
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['endpoint'] === 'api/users') {
    $sql = "SELECT user_id, first_name AS name FROM users";
    $result = $conn->query($sql);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);
}




?>