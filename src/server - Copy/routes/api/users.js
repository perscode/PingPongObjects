    function getUser(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'users.json');
        var user = json.filter(function(c) {
            return c.id === parseInt(req.params.id);
        });
        res.send(user[0]);
    }

    function getUsers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'users.json');
        res.send(json);
    }