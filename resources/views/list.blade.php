@extends('master')
@section('cssAndJs')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
@endsection

@section('content')
    <h2>Generování popisků pomocí ChatGPT</h2>
    @foreach($brands as $brand)
        <div class="brand">
            <div>Jméno : {{$brand->name}}</div>
            @if(!$brand->description)
                <select id="lang">
                    <option value="czech">Čeština</option>
                    <option value="slovak">Slovenština</option>
                    <option value="german">Němčina</option>
                    <option value="hungarian">Maďarština</option>
                    <option value="polish">Polština</option>
                    <option value="french">Francouzština</option>
                    <option value="english">Angličtina</option>
                </select>
                <a class="button" href="{{route('brands.show', ['id' => $brand->id, 'lang' => 'czech'])}}">Upravit</a>
                @else
                <span>Již vygenerováno</span>
                <a class="button" href="{{route('brands.show', ['id' => $brand->id])}}">Upravit</a>
            @endif
        </div>
        <hr>
    @endforeach

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            let lastValue = $('#lang').val();
            $('#lang').on('change', function () {
                let newHref = $(this).next('a')[0].href.replace(lastValue, $(this).val());
                $(this).next('a')[0].href = newHref;
            });
        })
    </script>
@endsection
