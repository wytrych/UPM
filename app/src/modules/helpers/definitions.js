window.modules = {};
window.define = (func, namespace) => {
    try {
        if (window.modules[namespace]) {
            throw new Error();
        }

       window.modules[namespace] = func();
    } catch (e) {
       console.log(`Namespace ${namespace} already in use.`);
    }
};
