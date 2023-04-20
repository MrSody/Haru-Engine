var customMapFormat = {
    name: "ProjectMMO",
    extension: "json",

    write: function(map, fileName) {
        var m = {
            width: 0,
            height: 0,
            layers: []
        };

        // Size map
        var layerOne = map.layers.filter(data => data.name == "1");
        
        m.width = parseInt(layerOne.map(data => data.width));
        m.height = parseInt(layerOne.map(data => data.height));
        
        for (var i = 0; i < map.layerCount; ++i) {
            var layer = map.layerAt(i);
            if (layer.isTileLayer) {
                let capa = [[]];

                for (y = 0; y < layer.height; ++y) {

                    let lineCapa = [];
                    capa[y] = [];

                    for (x = 0; x <= layer.width; ++x){

                        if (x == layer.width) {
                            capa[y] = lineCapa;
                        } else {
                            if (layer.name != "collision") {
                                if (layer.tileAt(x, y) != null) {
                                    lineCapa.push(layer.tileAt(x, y).id + 1);
                                } else {
                                    lineCapa.push(0);
                                }
                            } else {
                                if (layer.tileAt(x, y) != null) {
                                    lineCapa.push(1);
                                } else {
                                    lineCapa.push(0);
                                }
                            }
                        }

                    }
                }

                m.layers[i] = {name: layer.name, data: capa};
            }
        }

        var file = new TextFile(fileName, TextFile.WriteOnly);
        file.write(JSON.stringify(m));
        file.commit();
    },
}

tiled.registerMapFormat("custom", customMapFormat)