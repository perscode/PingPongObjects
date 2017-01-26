module.exports = function() {
    var service = {
        validatequery: validatequery
    };

    function validatequery(params){
        var urlparams = []; 
        for(var key in params){
            console.log("typeof params[key]: ", Array.isArray(params[key]));
            switch(key) {
                case "material": console.log("switch/case material"); urlparams.push({"material.id":params[key]}); break;
                case "buildingtype": console.log("switch/case buildingtype"); urlparams.push({"buildingtype.id":params[key]}); break; 
                case "countryiso": console.log("switch/case countryiso"); urlparams.push({"countryiso.id":params[key]}); break;
                case "contenttype": console.log("switch/case contenttype"); urlparams.push({"contenttype.id":params[key]}); break;
                case "functionalspace": console.log("switch/case functionalspace"); urlparams.push({"functionalspace.id":params[key]}); break;
                case "ifc": console.log("switch/case ifc"); urlparams.push({"ifc.id":params[key]}); break;
                case "listorder": console.log("switch/case listorder"); urlparams.push({"listorder.id":params[key]}); break;
                case "brand": console.log("switch/case brand"); urlparams.push({"brand": params[key]}); break;
            }
        };
        return urlparams;
    }

    return service;
}