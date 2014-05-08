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
global.Module = function (moduleReference) {
    "use strict";

    this.getReference = function () {

        if (false === this.depRef) {

            return moduleReference;
        }

        if (0 !== this.depRef.length) {

            return moduleReference.apply(this, this.depRef);
        }

        return moduleReference();
    };

    this.depRef = [];

    this.dep = function () {
        if (false === arguments[0]) {

            this.depRef = false;

            return this;
        }

        var args = null;
        if (arguments[0] instanceof Array) {
            args = arguments[0];
        } else {
            args = arguments;
        }

        var depTmp = {};

        for (var i in args) {
            if (!args.hasOwnProperty(i)) {
                continue;
            }

            depTmp = Require.isValid(args[i]);

            if (!depTmp) {
                try {
                    depTmp = Require.require(args[i]);
                } catch (e) {
                    console.log("\n\n\nError in require '" + args[i] + "' module.\n\n\n");
                }
            }

            this.depRef.push(depTmp);
        }

        return this;
    };
};
