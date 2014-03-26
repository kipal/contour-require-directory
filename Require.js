global.Require = function () {

};

Require.require = function (variableName) {
    var variablePieces = variableName.split("."),
        root           = Require.hasChild(global, variablePieces[0]);

    if (!root.basePath) {
        throw "Haveeeer hiányzik a basePath a " + variablePieces[0] + "-ból!!!";
    }

    variablePieces.shift();

    return require(root.basePath + "/" + variablePieces.join("/")).getReference();
};

Require.hasChild = function (parentRef, childStr) {
    if (undefined !== parentRef[childStr]) {
        return parentRef[childStr];
    }

    return false;
};

Require.isValid = function (variable) {
    var variablePieces = variable.split("."),
        partReference  = Require.hasChild(global, variablePieces[0]);

    if (!partReference["basePath"]) {

        return false;
    }

    if (partReference.isEmpty()) {

        return false;
    }

    for (var i = 1; i < variablePieces.length || false !== partReference; i++) {
        partReference = Require.hasChild(partReference, variablePieces[i]);
    }

    return partReference;
};