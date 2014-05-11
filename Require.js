/*******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Nándor Kiss
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
global.Require = function () {

};

Require.require = function (variableName) {
    var variablePieces = variableName.split("."),
        root           = Require.hasChild(global, variablePieces[0]);

    if (!root.basePath) {
        throw "Not found 'basePath' attribute from " + variablePieces[0] + "!";
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
