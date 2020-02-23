const Singleton = (function () {
    var instance;
 
     createInstance = (data) => {
        const object = new Object(data);
        return object;
    }
 
    return {
        getInstance: (data) => {
            if (!instance) {
                instance = createInstance(data);
            }
            return instance;
        }
    };
})();
 