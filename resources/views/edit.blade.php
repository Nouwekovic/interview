@extends('master')

@section('cssAndJs')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
@endsection

@section('content')
    <div>
        <h2>{{$brand->name}}</h2>
        <form name="brand-form" id="brand-form" method="post" action="{{route('brands.update', ['id' => $brand->id])}}">
            @csrf
            <div>
                <label for="exampleInputEmail1">Description</label>
            </div>
            <div>
                <textarea name="description" rows="20" cols="50" required>{{$description}}</textarea>
            </div>
            <div>
                <button type="submit" class="btn btn-primary">Uložit</button>
            </div>
        </form>
    </div>
    <div class="arrowButtons">
        @if($brand->id !== 1)
            <a href="{{route('brands.show', ['id' => --$brand->id, 'lang' => 'czech'])}}">< Předchozí</a>
        @endif
        @if($brand->id !== $maxId)
            <a href="{{route('brands.show', ['id' => ++$brand->id, 'lang' => 'czech'])}}">Následující ></a>
        @endif
    </div>

@endsection

