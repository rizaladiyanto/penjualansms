<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search'); // Ambil nilai pencarian dari query string

        $categories = Category::query()
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->orderBy('name', 'asc')
        ->get();
    
        return Inertia::render('Admin/ListCategory', [
            'categories' => $categories,
            'search' => $search,
            'success' => session('success'),
        ]);
    }
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Ambil semua kategori untuk pilihan parent
        $categories = Category::all();

        return inertia('Categories/Create', compact('categories')); // Kirim ke view Inertia
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:shop_categories,name',
            'parent_id' => 'nullable|exists:shop_categories,id', // Parent harus valid
        ]);

        // Buat slug dari nama
        $validated['slug'] = Str::slug($request->name);

        // Simpan kategori
        Category::create($validated);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // Ambil semua kategori untuk pilihan parent
        $categories = Category::where('id', '!=', $category->id)->get();

        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]); // Kirim ke view Inertia
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:shop_categories,name,' . $category->id,
            'parent_id' => 'nullable|exists:shop_categories,id',
        ]);

        // Perbarui slug
        $validated['slug'] = Str::slug($request->name);

        // Update kategori
        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Hapus kategori (beserta children, jika diperlukan)
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
