<?php
session_start();

$user = null;
if (isset($_SESSION['user_id'])) {
    $user = [
        'name' => $_SESSION['user_name'] ?? 'User',
        'avatar' => $_SESSION['user_avatar'] ?? '',
        'id' => $_SESSION['user_id']
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Silver Antara</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        silver: {
                            100: '#f5f5f7',
                            200: '#e1e1e3',
                            300: '#cfcfd1',
                            400: '#a1a1a6',
                            500: '#6e6e73',
                            600: '#424245',
                            700: '#1d1d1f',
                            800: '#121212',
                            900: '#000000',
                            brand: '#C7C9C8'
                        },
                        orange: {
                            brand: '#FB923C'
                        }
                    },
                    typography: (theme) => ({
                        DEFAULT: {
                            css: {
                                color: theme('colors.gray.300'),
                                strong: { color: theme('colors.white') },
                                a: { color: theme('colors.orange.500'), '&:hover': { color: theme('colors.orange.400') } },
                                h1: { color: theme('colors.white') },
                                h2: { color: theme('colors.white') },
                                h3: { color: theme('colors.white') },
                                code: { color: theme('colors.orange.300'), backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2em 0.4em', borderRadius: '0.25rem' },
                                'code::before': { content: '""' },
                                'code::after': { content: '""' },
                            },
                        },
                    }),
                }
            }
        }
    </script>
    <style>
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #121212; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        .prose p { margin-bottom: 0.8em; }
        .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.8em; }
        .prose ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.8em; }
        .prose pre { background: #1d1d1f; padding: 1em; border-radius: 0.5em; overflow-x: auto; margin-bottom: 1em; border: 1px solid #333; }
    </style>
</head>
<body class="bg-black text-silver-100 font-sans h-screen flex overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-64 bg-silver-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div class="p-6 border-b border-gray-800 flex flex-col items-center">
            <img src="assets/images/sam-logo.webp" alt="Silver Ant Logo" class="h-16 mb-4 object-contain">
            <button onclick="startNewChat()" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-orange-900/20">
                <span>+</span> New Chat
            </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-2" id="thread-list">
            <!-- Threads will be populated by API -->
        </div>

        <div class="p-4 border-t border-gray-800 flex items-center gap-3">
            <?php if ($user): ?>
                <img src="<?= htmlspecialchars($user['avatar']) ?>" class="w-8 h-8 rounded-full">
                <div class="flex-1 overflow-hidden">
                    <p class="text-xs text-white font-bold truncate"><?= htmlspecialchars($user['name']) ?></p>
                    <a href="logout.php" class="text-xs text-gray-500 hover:text-white">Sign Out</a>
                </div>
            <?php else: ?>
                <div class="flex-1 text-center">
                    <a href="callback.php" class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 transition">
                         <svg class="w-3 h-3" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                         Sign in with Google
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </aside>

    <!-- Main Chat Area -->
    <main class="flex-1 flex flex-col h-full relative">
        <!-- Top Bar -->
        <header class="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-silver-800/50 backdrop-blur-sm z-10">
            <div class="flex items-center gap-3">
                <img src="assets/images/sam-logo.webp" alt="Silver Ant Logo" class="h-8 md:hidden object-contain">
                <span class="md:hidden text-orange-500 font-bold mr-2">Silver AI</span>
                <span class="text-gray-400 text-sm hidden sm:inline">Model: <span class="text-white font-medium">Llama 3.1 8B</span></span>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-sm text-gray-400 hidden sm:block">Status: <span class="text-green-500">● Online</span></div>
                <?php if(!$user): ?>
                    <a href="callback.php" class="md:hidden text-xs bg-gray-700 text-white px-3 py-2 rounded">Sign In</a>
                <?php endif; ?>
            </div>
        </header>

        <!-- Messages Area -->
        <div id="chat-window" class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <!-- Messages injected here -->
        </div>

        <!-- Input Area -->
        <div class="p-4 md:p-6 border-t border-gray-800 bg-black">
            <form id="chat-form" class="max-w-4xl mx-auto relative flex items-end gap-2 bg-silver-800 border border-gray-700 rounded-xl p-2 shadow-lg focus-within:border-orange-500 transition-colors">
                <textarea id="user-input" rows="1" placeholder="Message Silver AI..." 
                       class="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 focus:outline-none resize-none max-h-48 overflow-y-auto"
                       oninput="autoResize(this)" onkeydown="handleEnter(event)"></textarea>
                
                <button type="submit" class="p-3 bg-orange-600 hover:bg-orange-500 rounded-lg transition text-white flex-shrink-0 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
            </form>
            <p class="text-center text-xs text-gray-600 mt-2">AI can make mistakes. Please verify important information.</p>
        </div>
    </main>

    <script>
        // ... (Keep existing JS logic, but we'll need to update it to fetch from DB instead of localStorage next) ...
        const form = document.getElementById('chat-form');
        const chatWindow = document.getElementById('chat-window');
        const threadList = document.getElementById('thread-list');
        const input = document.getElementById('user-input');

        // !!! TEMPORARY: Still using LocalStorage until we add API endpoints for threads !!!
        let threads = JSON.parse(localStorage.getItem('silver_ai_threads') || '[]');
        let activeThreadId = null;

        function autoResize(el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }

        function handleEnter(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        }

        function init() {
            renderThreadList();
            if (threads.length > 0) {
                loadThread(threads[0].id);
            } else {
                startNewChat();
            }
        }

        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        function startNewChat() {
            activeThreadId = generateId();
            const newThread = {
                id: activeThreadId,
                title: 'New Chat',
                messages: [{
                    role: 'system',
                    content: 'Hello! I am Antara the Silver Ant\'s AI Assistant, ready to assist with Silver Ant Marketing operations. How can I help you today?',
                    timestamp: Date.now()
                }]
            };
            threads.unshift(newThread);
            saveThreads();
            renderThreadList();
            renderMessages(newThread.messages);
        }

        function saveThreads() {
            localStorage.setItem('silver_ai_threads', JSON.stringify(threads));
        }

        function renderThreadList() {
            threadList.innerHTML = '';
            threads.forEach(thread => {
                const div = document.createElement('div');
                div.className = `group flex items-center mb-1 rounded-lg transition ${thread.id === activeThreadId ? 'bg-gray-800 border border-gray-700' : 'hover:bg-gray-800'}`;

                const btn = document.createElement('button');
                btn.className = `flex-1 text-left p-3 text-sm truncate ${thread.id === activeThreadId ? 'text-white' : 'text-gray-400 group-hover:text-white'}`;
                btn.textContent = thread.title;
                btn.onclick = () => loadThread(thread.id);

                const delBtn = document.createElement('button');
                delBtn.className = 'p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition';
                delBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteThread(thread.id);
                };

                div.appendChild(btn);
                div.appendChild(delBtn);
                threadList.appendChild(div);
            });
        }

        function deleteThread(id) {
            if(!confirm('Are you sure you want to delete this chat?')) return;
            
            threads = threads.filter(t => t.id !== id);
            saveThreads();
            
            if (threads.length === 0) {
                startNewChat();
            } else if (id === activeThreadId) {
                loadThread(threads[0].id);
            } else {
                renderThreadList();
            }
        }

        function loadThread(id) {
            activeThreadId = id;
            const thread = threads.find(t => t.id === id);
            if (!thread) return;
            renderThreadList();
            renderMessages(thread.messages);
        }

        function renderMessages(messages) {
            chatWindow.innerHTML = '';
            messages.forEach(msg => appendMessageToUI(msg));
            scrollToBottom();
        }

        function appendMessageToUI(msg) {
            const isUser = msg.role === 'user';
            const div = document.createElement('div');
            div.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
            
            const bubble = document.createElement('div');
            bubble.className = `max-w-3xl rounded-lg p-5 ${isUser ? 'bg-gray-800 border border-gray-700' : 'bg-transparent pl-0'}`;
            
            if (isUser) {
                bubble.innerHTML = `<p class="text-gray-300 leading-relaxed whitespace-pre-wrap">${msg.content}</p>`;
            } else {
                const parsedContent = DOMPurify.sanitize(marked.parse(msg.content));
                bubble.innerHTML = `
                    <div class="flex gap-4">
                        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-600">
                             <img src="assets/images/sam-logo.webp" class="h-5 w-5 object-contain" alt="AI">
                        </div>
                        <div class="prose prose-invert max-w-none text-gray-300">
                            ${parsedContent}
                        </div>
                    </div>`;
            }

            div.appendChild(bubble);
            chatWindow.appendChild(div);
        }

        function scrollToBottom() {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        form.onsubmit = async (e) => {
            e.preventDefault();
            const msg = input.value.trim();
            if(!msg) return;

            const userMsg = { role: 'user', content: msg, timestamp: Date.now() };
            const threadIndex = threads.findIndex(t => t.id === activeThreadId);
            if (threadIndex === -1) return; 

            threads[threadIndex].messages.push(userMsg);
            
            if (threads[threadIndex].messages.length === 2) {
                threads[threadIndex].title = msg.substring(0, 30) + (msg.length > 30 ? '...' : '');
            }

            appendMessageToUI(userMsg);
            saveThreads();
            renderThreadList();
            
            input.value = '';
            input.style.height = 'auto';
            input.rows = 1;
            
            scrollToBottom();

            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading-indicator';
            loadingDiv.className = 'flex justify-start';
            loadingDiv.innerHTML = `
                <div class="max-w-3xl rounded-lg p-5 flex gap-4">
                     <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-600">
                             <img src="assets/images/sam-logo.webp" class="h-5 w-5 object-contain" alt="AI">
                     </div>
                     <div class="text-gray-500 animate-pulse">Thinking...</div>
                </div>`;
            chatWindow.appendChild(loadingDiv);
            scrollToBottom();

            try {
                const response = await fetch('chat-handler.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: msg })
                });
                const data = await response.json();
                
                document.getElementById('loading-indicator').remove();

                const aiMsg = { role: 'assistant', content: data.answer, timestamp: Date.now() };
                threads[threadIndex].messages.push(aiMsg);
                appendMessageToUI(aiMsg);
                saveThreads();

            } catch (err) {
                document.getElementById('loading-indicator').remove();
                alert('Error connecting to Silver AI: ' + err);
            }
        };

        init();
    </script>
</body>
</html>
