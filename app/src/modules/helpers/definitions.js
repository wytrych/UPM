window.modules = {};
const require = (namespace) => window.modules[namespace];
window.define = (func, namespace) => {
    console.log(func);
//    try {
     //   if (window.modules[namespace]) {
     //       throw new Error();
     //   }

       window.modules[namespace] = func(require);
//    } catch (e) {
//       console.log(e,`Namespace ${namespace} already in use.`);
//    }
};

window.modules._ = window._();
