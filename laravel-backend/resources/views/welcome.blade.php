<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow">

        <title>Silver AI Hub | Enterprise Intelligence Suite</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

        <!-- Styles / Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <script src="https://cdn.tailwindcss.com"></script>
        @endif
        
        <style>
            body { font-family: 'Instrument Sans', sans-serif; }
            .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
            .elara-gradient { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); }
            .text-gradient { background: linear-gradient(to right, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        </style>
    </head>
    <body class="bg-[#050505] text-white min-h-screen selection:bg-indigo-500/30">
        <!-- Navigation -->
        <header class="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div class="flex items-center gap-3 group cursor-pointer" onclick="window.location.reload()">
                <div class="w-10 h-10 elara-gradient rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                    <img src="https://silverantmarketing.com/wp-content/uploads/2021/06/header-light-logo-sam.webp" alt="Silver AI" class="w-6 h-6 object-contain">
                </div>
                <div class="flex flex-col">
                    <span class="text-xl font-bold tracking-tight leading-none uppercase">Silver AI</span>
                    <span class="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Intelligence Hub</span>
                </div>
            </div>

            <nav class="flex items-center gap-8">
                <a href="https://elara.silverantacademy.com/app" class="hidden md:block text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Enterprise App</a>
                <a href="https://elara.silverantacademy.com/app" class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                    Interact with Elara
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </nav>
        </header>

        <!-- Hero Section -->
        <main class="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
            <!-- Background Glow -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full"></div>

            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 animate-fade-in text-indigo-400">
                <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Silver Core AI 2026 Powered
            </div>
 
            <h1 class="text-6xl lg:text-8xl font-black tracking-tighter mb-8 max-w-5xl leading-[0.9]">
                The Hub for <br/> <span class="text-gradient">Elite Intelligence.</span>
            </h1>
            
            <p class="text-xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-medium">
                Silver AI Hub is an enterprise-grade ecosystem that centralizes your agency's intelligence, enabling custom AI Agents (Ants) to automate complex marketing workflows with surgical precision.
            </p>

            <div class="flex flex-col sm:flex-row gap-6">
                <a href="https://elara.silverantacademy.com/app" class="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-50 transition-all hover:scale-105">
                    Launch Elara Interface
                </a>
                <a href="https://elara.silverantacademy.com/app" class="px-10 py-5 glass border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors">
                    Explore Ants Hub
                </a>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
                <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Ants Core</h3>
                    <p class="text-gray-400 leading-relaxed">Create and manage specialized AI personas tuned for SEO, SMM, and Creative Strategizing with persistent identities.</p>
                </div>
                <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Secure Execution</h3>
                    <p class="text-gray-400 leading-relaxed">Enterprise-grade data isolation ensures your agency credentials and client data never leave your secure environment.</p>
                </div>
                <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Llama 3.1 Ready</h3>
                    <p class="text-gray-400 leading-relaxed">Powered by Cloudflare Workers AI with the latest Meta Llama models for lightning-fast, state-of-the-art responses.</p>
                </div>
            </div>

            <!-- Dashboard Preview -->
            <div class="mt-20 w-full relative group max-w-6xl">
                <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div class="relative glass border border-white/10 rounded-[2rem] p-2 shadow-2xl overflow-hidden shadow-indigo-500/10">
                    <img src="/app/chat-ui.webp" alt="Silver AI Interface" class="w-full h-auto rounded-[1.5rem] shadow-2xl border border-white/5 opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    <!-- Floating Badge -->
                    <div class="absolute bottom-10 right-10 glass border border-white/10 px-6 py-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4 animate-bounce-slow">
                        <div class="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div class="text-left">
                            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Response Time</p>
                            <p class="text-lg font-black text-white leading-none">< 400ms</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section: Specialized Ants -->
            <div class="mt-48 w-full text-center">
                <h2 class="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">The Colony of <span class="text-gradient">Ants.</span></h2>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-16 font-medium">Domain-specific AI assistants trained for specialized operational roles within Silver Ant Marketing.</p>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m1-4h7m-7 20h7" />
                            </svg>
                        </div>
                        <h4 class="font-bold text-white text-sm mb-1 uppercase tracking-tight">Code Wizard</h4>
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Technical Lead</p>
                    </div>
                    <div class="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <h4 class="font-bold text-white text-sm mb-1 uppercase tracking-tight">Muse</h4>
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Creative Partner</p>
                    </div>
                    <div class="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h4 class="font-bold text-white text-sm mb-1 uppercase tracking-tight">ROAS Tracker</h4>
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">PPC Strategist</p>
                    </div>
                    <div class="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <h4 class="font-bold text-white text-sm mb-1 uppercase tracking-tight">Brief</h4>
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Summarization</p>
                    </div>
                </div>
            </div>

            <!-- Section: Elite Architecture -->
            <div class="my-48 w-full glass border border-white/5 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                
                <div class="flex flex-col md:flex-row items-center gap-16">
                    <div class="flex-1 text-left">
                        <h3 class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">Powered by <br/> <span class="text-indigo-400">Meta Llama 3.1</span></h3>
                        <p class="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                            Silver AI Hub utilizes the processing power of Cloudflare Workers AI, providing military-grade encryption and low-latency response times across all specialized models.
                        </p>
                        <div class="flex gap-4">
                            <a href="https://elara.silverantacademy.com/app" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">Get Access Now</a>
                        </div>
                    </div>
                    <div class="flex-1 grid grid-cols-2 gap-4">
                        <div class="bg-white/5 border border-white/5 p-8 rounded-3xl transition-transform hover:-translate-y-2">
                            <p class="text-4xl font-black text-white mb-2 tracking-tighter">100%</p>
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Private Data</p>
                        </div>
                        <div class="bg-white/5 border border-white/5 p-8 rounded-3xl transition-transform hover:-translate-y-2">
                            <p class="text-4xl font-black text-white mb-2 tracking-tighter">8B+</p>
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Parameters</p>
                        </div>
                        <div class="bg-white/10 border border-white/10 p-8 rounded-3xl transition-transform hover:-translate-y-2 col-span-2">
                            <div class="flex items-center gap-4">
                                <span class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                                <p class="text-sm font-bold text-white uppercase tracking-widest">Network Operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="py-12 px-6 border-t border-white/5 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-6">
            <div class="text-sm text-gray-500 uppercase font-black tracking-widest">
                &copy; {{ date('Y') }} Silver Ant Marketing AI.
            </div>
            <div class="flex gap-8 text-sm text-gray-400">
                <a href="#" class="hover:text-white transition-colors">Twitter</a>
                <a href="#" class="hover:text-white transition-colors">GitHub</a>
                <a href="#" class="hover:text-white transition-colors">Discord</a>
            </div>
        </footer>
    </body>
</html>
