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

        var depTmp = {};

        for (var i in arguments) {
            if (!arguments.hasOwnProperty(i)) {
                continue;
            }

            depTmp = Require.isValid(arguments[i]);

            if (!depTmp) {
                try {
                    depTmp = Require.require(arguments[i]);
                } catch (e) {
                    console.log("\n\n\nError in require '" + arguments[i] + "' module.\n\n\n");
                }
            }

            this.depRef.push(depTmp);
        }

        return this;
    };
};