session_start();
require_once '../vendor/autoload.php'; // Adjusted path for detached independent project
require_once '../DB.php';

// Load Config
$config = json_decode(file_get_contents('../silver_config.json'), true);
$googleConfig = $config['auth']['google'] ?? [];

if (empty($googleConfig['client_id']) || empty($googleConfig['client_secret'])) {
    die("Please configure Google Client ID and Secret in silver_config.json");
}

$client = new Google\Client();
$client->setClientId($googleConfig['client_id']);
$client->setClientSecret($googleConfig['client_secret']);
$client->setRedirectUri('http://localhost:8000/silver-ai/public/callback.php');
$client->addScope("email");
$client->addScope("profile");

if (!isset($_GET['code'])) {
    header('Location: ' . $client->createAuthUrl());
    exit;
} else {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    
    if(isset($token['error'])){
        die("Error fetching token: " . $token['error']);
    }

    $client->setAccessToken($token['access_token']);
    $google_oauth = new Google\Service\Oauth2($client);
    $google_account_info = $google_oauth->userinfo->get();
    
    $google_id = $google_account_info->id;
    $email = $google_account_info->email;
    $name = $google_account_info->name;
    $avatar = $google_account_info->picture;

    // Save/Update User
    $pdo = DB::connect();
    $stmt = $pdo->prepare("SELECT id FROM users WHERE google_id = ?");
    $stmt->execute([$google_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $user_id = $user['id'];
        // Update avatar/name if changed? Optional.
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (google_id, email, name, avatar) VALUES (?, ?, ?, ?)");
        $stmt->execute([$google_id, $email, $name, $avatar]);
        $user_id = $pdo->lastInsertId();
    }

    // Set Session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_avatar'] = $avatar;
    $_SESSION['is_logged_in'] = true;

    // Redirect to Main App
    header('Location: index.php');
    exit;
}
