<?php
class DB {
    private static $pdo;

    public static function connect() {
        if (!self::$pdo) {
            try {
                // Adjust path as needed. Using absolute path for safety in this setup.
                $dbPath = __DIR__ . '/silver.db';
                self::$pdo = new PDO("sqlite:$dbPath");
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                // Enable foreign keys
                self::$pdo->exec("PRAGMA foreign_keys = ON;");
            } catch (PDOException $e) {
                die("Database Connection Error: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }

    public static function init() {
        $pdo = self::connect();
        $sql = file_get_contents(__DIR__ . '/database.sql');
        $pdo->exec($sql);
    }
}
