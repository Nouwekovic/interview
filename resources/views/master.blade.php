<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Xzone pohovor</title>
    @yield('cssAndJs')
</head>
<body>
<nav>
    <a class="button" href="{{route('cashregister')}}">Pokladna</a>
    <a class="button" href="{{route('brands')}}">ChatGPT</a>
</nav>
@yield('content')
<a class="button" href="https://github.com/Nouwekovic/interview">Github repo</a>
</body>
</html>
