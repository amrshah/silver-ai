<?php
require_once 'DB.php';
// Initialize DB table on first run if needed
DB::init();
echo "Database initialized successfully.";
