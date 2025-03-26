<?php
include_once 'dbServerConnect.php';
// Fetch all users
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['token'] === 'allUsers') {
    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);
}
$conn->close();
?>