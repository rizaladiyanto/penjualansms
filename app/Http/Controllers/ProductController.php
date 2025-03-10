<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */    
    public function index(Request $request)
    {
        $search = $request->query('search'); // Ambil nilai pencarian dari query string
    
        $products = Product::with('user')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                             ->orWhere('sku', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'status' => $product->status,
                    'stock_status' => $product->stock_status,
                    'featured_image' => $product->featured_image_url, // Gunakan accessor
                ];
            });
    
        return Inertia::render('Admin/ListProduct', [
            'products' => $products,
            'search' => $search, // Kirim search term ke frontend
            'success' => session('success'),
        ]);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();

        return Inertia::render('Products/Create', compact('products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku'          => 'required|string|max:255|unique:shop_products,sku',
            'name'         => 'required|string',
            'type'         => 'required|string|max:255', // Menambahkan validasi untuk type
            'status' => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
        ]);
    
        $validated['slug'] = Str::slug($request->name);
        $validated['user_id'] = auth()->user()->id;
    
        $product = Product::create($validated);
    
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $product = Product::with('inventory')->findOrFail($id);

        return Inertia::render('Admin/EditProduct', [
            'product' => $product,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::with('inventory')->findOrFail($id);
        $request->merge([
            'manage_stock' => filter_var($request->manage_stock, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false
        ]);        

        $validated = $request->validate([
            'sku' => 'required|string|max:255|unique:shop_products,sku,' . $product->id,
            'name'           => 'required',
            'type'           => 'required|string|max:255', // Tambahkan validasi type
            'price'          => 'required|numeric|min:0',
            'sale_price'     => 'nullable|numeric|min:0',
            'status'         => 'required|in:' . implode(',', array_keys(Product::STATUSES)),
            'stock_status'   => 'required|in:' . implode(',', array_keys(Product::STOCK_STATUSES)),
            'excerpt'        => 'nullable|string',
            'body'           => 'nullable|string',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg|max:4096|min:50',
            'manage_stock'   => 'required|boolean',
            'qty'            => $request->manage_stock ? 'required|integer|min:0' : 'nullable|integer|min:0',
            'low_stock_threshold' => $request->manage_stock ? 'required|integer|min:0' : 'nullable|integer|min:0',

        ]);
        $validated['slug'] = Str::slug($request->name);

        // Simpan gambar baru
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product-images', 'public');
            $validated['featured_image'] = $imagePath;
        }
        
        $product->update($validated);

        if ($request->manage_stock) {
            $product->inventory()->updateOrCreate(
                ['product_id' => $product->id],
                [
                    'qty' => $request->qty ?? 0, 
                    'low_stock_threshold' => $request->low_stock_threshold ?? 0
                ]
            );
        } else {
            $product->inventory()->delete();
        }        

        return response()->json(['message'=>'sucess']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->categories()->detach();

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->name);
            $image->delete();
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    public function toggleManageStock(Request $request, Product $product)
    {
        $product->manage_stock = !$product->manage_stock;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Manage stock updated successfully',
            'manage_stock' => $product->manage_stock
        ]);
    }
}

