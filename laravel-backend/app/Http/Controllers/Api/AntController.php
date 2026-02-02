<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ant;
use App\Models\AntRole;
use Illuminate\Http\Request;

class AntController extends Controller
{
    /**
     * Get all applets available to the user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        return Ant::where(function($query) use ($user, $role) {
            $query->where('is_global', true)
                  ->orWhere('user_id', $user->id)
                  ->orWhere('is_public', true)
                  ->orWhereHas('roles', function($q) use ($role) {
                      $q->where('role_name', $role);
                  });
        })->get();
    }

    /**
     * Store a new applet (User created or Admin created).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'icon' => 'nullable|string',
            'system_instruction' => 'required|string',
            'category' => 'required|string',
            'is_public' => 'boolean',
            'assigned_roles' => 'nullable|array',
        ]);

        $user = $request->user();
        
        $ant = Ant::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon ?? 'Sparkles',
            'system_instruction' => $request->system_instruction,
            'category' => $request->category,
            'is_public' => $request->is_public ?? false,
            // Only admins can make global or system apps
            'is_system' => $user->is_admin ? ($request->is_system ?? false) : false,
            'is_global' => $user->is_admin ? ($request->is_global ?? false) : false,
        ]);

        if ($request->has('assigned_roles') && $user->is_admin) {
            foreach ($request->assigned_roles as $roleName) {
                AntRole::create([
                    'ant_id' => $ant->id,
                    'role_name' => $roleName
                ]);
            }
        }

        return response()->json($ant->load('roles'), 201);
    }

    /**
     * Admin tool to manage applets.
     */
    public function adminIndex(Request $request)
    {
        if (!$request->user()->is_admin) abort(403);
        return Ant::with('roles')->get();
    }

    /**
     * Toggle visibility/sharing.
     */
    public function update(Request $request, Ant $ant)
    {
        $user = $request->user();
        if ($ant->user_id !== $user->id && !$user->is_admin) abort(403);

        $ant->update($request->only([
            'name', 'description', 'icon', 'system_instruction', 'category', 'is_public'
        ]));

        if ($user->is_admin) {
            $ant->update($request->only(['is_system', 'is_global']));
            
            if ($request->has('assigned_roles')) {
                $ant->roles()->delete();
                foreach ($request->assigned_roles as $roleName) {
                    AntRole::create([
                        'ant_id' => $ant->id,
                        'role_name' => $roleName
                    ]);
                }
            }
        }

        return $ant->load('roles');
    }

    public function destroy(Request $request, Ant $ant)
    {
        $user = $request->user();
        if ($ant->user_id !== $user->id && !$user->is_admin) abort(403);
        
        $ant->delete();
        return response()->json(['success' => true]);
    }
}
