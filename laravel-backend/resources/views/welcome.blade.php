<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Elara | Intelligent AI Companion</title>

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
        <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div class="flex items-center gap-2 group cursor-pointer">
                <div class="w-8 h-8 elara-gradient rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-300"></div>
                <span class="text-xl font-bold tracking-tight">Elara</span>
            </div>

            @if (Route::has('login'))
                <nav class="flex items-center gap-6">
                    @auth
                        <a href="{{ url('/dashboard') }}" class="text-sm font-medium hover:text-indigo-400 transition-colors">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="text-sm font-medium hover:text-indigo-400 transition-colors">Sign In</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all">Get Started</a>
                        @endif
                    @endauth
                </nav>
            @endif
        </header>

        <!-- Hero Section -->
        <main class="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
            <!-- Background Glow -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full"></div>

            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium mb-8 animate-fade-in">
                <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Elara v2.0 is now live
            </div>

            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
                Experience the next generation of <span class="text-gradient">intelligence.</span>
            </h1>
            
            <p class="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
                Elara seamlessly integrates with your workflow, providing intuitive AI assistance that learns your preferences and automates your most complex tasks.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
                <a href="#" class="px-8 py-4 elara-gradient rounded-full font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
                    Start Building Now
                </a>
                <a href="#" class="px-8 py-4 glass border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors">
                    View Documentation
                </a>
            </div>

            <!-- Dashboard Preview -->
            <div class="mt-20 w-full glass border border-white/10 rounded-2xl p-2 shadow-2xl relative group overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
                <div class="bg-[#0a0a0a] rounded-xl aspect-video w-full flex items-center justify-center border border-white/5 overflow-hidden">
                    <div class="grid grid-cols-12 gap-4 w-full h-full p-6">
                        <div class="col-span-3 space-y-4">
                            <div class="h-4 w-2/3 bg-white/10 rounded"></div>
                            <div class="h-32 w-full bg-white/5 rounded-lg border border-white/5"></div>
                            <div class="h-4 w-full bg-white/10 rounded"></div>
                            <div class="h-4 w-5/6 bg-white/10 rounded"></div>
                        </div>
                        <div class="col-span-9 bg-white/5 rounded-lg border border-white/5 p-8 relative">
                            <div class="absolute top-4 right-4 flex gap-2">
                                <div class="w-3 h-3 rounded-full bg-red-500/20"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500/20"></div>
                            </div>
                            <div class="space-y-6">
                                <div class="h-8 w-1/3 bg-indigo-500/20 rounded"></div>
                                <div class="space-y-3">
                                    <div class="h-4 w-full bg-white/10 rounded"></div>
                                    <div class="h-4 w-full bg-white/10 rounded"></div>
                                    <div class="h-4 w-2/3 bg-white/10 rounded"></div>
                                </div>
                                <div class="grid grid-cols-3 gap-4 pt-8">
                                    <div class="h-20 bg-white/5 rounded border border-white/5"></div>
                                    <div class="h-20 bg-white/5 rounded border border-white/5"></div>
                                    <div class="h-20 bg-white/5 rounded border border-white/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="py-12 px-6 border-t border-white/5 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-6">
            <div class="text-sm text-gray-500">
                &copy; {{ date('Y') }} Elara AI. Crafted for the future.
            </div>
            <div class="flex gap-8 text-sm text-gray-400">
                <a href="#" class="hover:text-white transition-colors">Twitter</a>
                <a href="#" class="hover:text-white transition-colors">GitHub</a>
                <a href="#" class="hover:text-white transition-colors">Discord</a>
            </div>
        </footer>
    </body>
</html>
