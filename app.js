let script;
let mapa;
let markers = [];

let inicio = false;
initMap();

let fichero = "api.gasolineras.json";
cargarFichero(fichero);

function initMap() {
    const LatLong = {
        lat: 42.85,
        lng: -2.6667
    };
    //console.log(latLng);
    this.mapa = new google.maps.Map(document.getElementById("mapa"), {
        center: LatLong,
        zoom: 14
    });

    return;
}

function colocarPines(data) {
    let lat;
    let lng;

    /********************** */
    console.log(data);

    let marker;

    var iconBase = "http://maps.google.com/mapfiles/ms/micons/";
    var icons = {
        gasolinera: {
            name: "gasolinera",
            icon: iconBase + "gas.png"
        }
    };

    icono = icons.gasolinera.icon;

    data.ListaEESSPrecio.forEach(element => {

        lat = element.Latitud;
        lng = element["Longitud (WGS84)"]
            //console.log("Latitud:" + lat);
            //console.log("Longitud:" + lng);

        rotulo = element.Rótulo;
        direccion = element.Dirección;
        provincia = element.Provincia;
        municipio = element.Municipio;
        precioGasoleoA = element["Precio Gasoleo A"];
        precioGasoleoB = element["Precio Gasoleo B"];
        precioGasolinaA = element["Precio Gasolina 95 Protección"];
        precioGasolinaB = element["Precio Gasolina 98"];

        console.log("Provincia:" + provincia);

        if ((provincia === 'ÁLAVA') || (provincia === 'GUIPÚZCOA') || (provincia === 'VIZCAYA')) {
            console.log("Gasolina 98:" + precioGasolinaB);

            if (lat != null || lng != null) {
                lat = lat.replace(",", ".");
                lng = lng.replace(",", ".");
            }

            const coordenadas = {
                lat: Number(lat),
                lng: Number(lng)
            };

            let marker = new google.maps.Marker({
                position: coordenadas,
                map: this.mapa,
                icon: icono
            });
            markers.push(marker);

            let infoWindowActivo = crearInfoWindow(
                rotulo,
                direccion,
                municipio,
                provincia,
                precioGasoleoA,
                precioGasoleoB,
                precioGasolinaA,
                precioGasolinaB
            );

            marker.addListener("click", () => {
                if (infoWindowActivo) {
                    infoWindowActivo.close();
                }

                infoWindow.open(this.mapa, marker);
                infoWindowActivo = infoWindow;
            });
        }
    });

    return;
}

function crearInfoWindow(
    rotulo,
    direccion,
    municipio,
    provincia,
    precioGasoleoA,
    precioGasoleoB,
    precioGasolinaA,
    precioGasolinaB
) {

    let markerInfo = `<h1>Estación de Servicio ${rotulo}</h1>`
    markerInfo += `
        <br>${direccion}</br>
        <br><b>Municipio</b>: ${municipio}
        <br><b>Provincia</b>: ${provincia}`;

    if ((precioGasoleoA !== undefined) && (precioGasoleoA !== null))
        markerInfo += `<br><b>Gasoleo A</b>: ${precioGasoleoA}`;
    if ((precioGasoleoB !== undefined) && (precioGasoleoB !== null))
        markerInfo += `<br><b>Gasoleo B</b>: ${precioGasoleoB}`;
    if ((precioGasolinaA !== undefined) && (precioGasolinaA !== null))
        markerInfo += `<br><b>Gasolina 95</b>: ${precioGasolinaA}`;
    if ((precioGasolinaB !== undefined) && (precioGasolinaB !== null))
        markerInfo += `<br><b>Gasolina 98</b>: ${precioGasolinaB}`;

    infoWindow = new google.maps.InfoWindow({
        content: markerInfo
    });

    return infoWindow;
}

function cargarFichero(fichero) {
    let xhr = new XMLHttpRequest();
    let datos;
    xhr.open("GET", fichero, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            datos = JSON.parse(this.responseText);
            initMap();
            colocarPines(datos);
            console.log(datos);
        }
    };
    xhr.send();
}