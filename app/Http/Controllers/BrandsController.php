<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Http\Request;

class BrandsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return string
     */
    public function index()
    {
        return view('list')->withBrands(Brands::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @param string|null $lang
     * @return Response
     */
    public function show(int $id, string $lang = null)
    {
        $brand = Brands::where('id', $id)->get()->first();
        $maxId = Brands::max('id');

        $result = ($brand->description && $lang === null) ? $brand->description : OpenAI::completions()->create([
            'model' => 'text-davinci-003',
            'prompt' => "Write about $brand->name in $lang language",
            'max_tokens' => 350,
        ]);

        $descriptionText = ($brand->description && $lang === null) ? $brand->description : $result['choices'][0]['text'];

        return view("edit")->withBrand($brand)->withDescription($descriptionText)->withMaxId($maxId);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     */
    public function update(int $id): RedirectResponse
    {
        $brand = Brands::find($id);
        $brand->description = \request('description');
        $brand->save();

        return to_route('brands.show', ['id' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
