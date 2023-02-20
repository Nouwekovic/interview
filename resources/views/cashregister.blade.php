@extends('master')
@section('cssAndJs')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
@endsection
@section('content')
    <h2>Reaktivní pokladna</h2>
    <main id="app"></main>
@endsection
