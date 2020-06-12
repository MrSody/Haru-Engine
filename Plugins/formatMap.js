var customMapFormat = {
    name: "ProjectMMO",
    extension: "json",

    write: function(map, fileName) {
        var m = {
            width: map.width,
            height: map.height,
            layers: [],
		    tilesets: []
        };

        for (var i = 0; i < map.layerCount; ++i) {
            var layer = map.layerAt(i);
            if (layer.isTileLayer) {
                let row = [];
                for (y = 0; y < layer.height; ++y) {
                    for (x = 0; x < layer.width; ++x){
                        if (layer.name == "collision") {
                            if (layer.cellAt(x, y).tileId != 0) {
                                row.push(1);
                            } else {
                                row.push(0);
                            }
                        } else {
                            row.push(layer.cellAt(x, y).tileId);
                        }
                    }
                }
                m.layers[i] = {name: layer.name, data: row};
            }
        }

        let countTileSets = map.usedTilesets();
        
        for (var i = 0; i < countTileSets.length; i++) {
            var tileset = countTileSets[i];
            m.tilesets[i] = {name: tileset.name, tileCount: tileset.tileCount, imageWidth: tileset.imageWidth, imageHeight: tileset.imageHeight};
        }

        var file = new TextFile(fileName, TextFile.WriteOnly);
        file.write(JSON.stringify(m));
        file.commit();
    },
}

tiled.registerMapFormat("custom", customMapFormat)