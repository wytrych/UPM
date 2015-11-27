'use strict';

describe('Structures module: ', function () {
    'use strict';

    console.log('test');
    var module;

    beforeEach(function () {
        console.log(window.modules.components);
        module = window.modules.structures;
    });

    it('should create a data manager', function () {
        var dc = module.dataContainer;
    });
});