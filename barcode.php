<?php
// Include the database connection script
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['barcode'])) {
        $barcode = $_POST['barcode'];
        
        // Prepare and bind
        $stmt = $conn->prepare("INSERT INTO scanned_barcodes (barcode) VALUES (?)");
        $stmt->bind_param("s", $barcode);

        // Execute the statement
        if ($stmt->execute()) {
            echo "Scanned Barcode: " . $barcode;

            // Check the barcode value and redirect if it matches
            if ($barcode === '21076138' || $barcode === 'B2000066') {
                header('Location: success.html');
                exit();
            }
        } else {
            echo "Error: " . $stmt->error;
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();
    } else {
        echo "No barcode received";
    }
} else {
    echo "Invalid request method";
}
?>
