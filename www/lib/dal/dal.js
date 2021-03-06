window.dal = {
    //opening db
    dbopen: function (dbname) {
        var self = this;
        this.db = openDatabase(dbname, '1.0', 'Application DB', 2 * 1024 * 1024);
    },
    //query execution

    executesql: function (query, callback) {
        var self = this;
        self.db.transaction(
                function (tx) {
                    tx.executeSql(query, [],
                            function (tx, results)
                            {
                                var len = results.rows.length;
                                var row = [];
                                for (i = 0; i < len; i = i + 1) {
                                    row[i] = results.rows.item(i);
                                }
                                if (callback) {
                                    callback(row);
                                }
                            })
                },
                function (tx) {
                       console.log(tx.message);
                }
        );
    },
    //create tables
    tables: function (dbtable) {
        var self = this;
        for (table in dbtable) {
            var query = "CREATE TABLE IF NOT EXISTS " + table + "(id INTEGER PRIMARY KEY AUTOINCREMENT, " + dbtable[table].join(", ") + ", d_date, d_time);";
            self.executesql(query);
        }
    },
    //create new data in to table
    create: function (table_name, insert_array) {
        var fields = [];
        var values = [];
        for (key in insert_array) {
            fields.push(key);
            values.push(insert_array[key]);
        }
        var dbdate = new Date();
        var dj = dbdate.toJSON();
        var dl = dj.split("T");
        var date = dl[0];
        var time = dl[1].split(".")[0];

        values.push(date);
        values.push(time);

        var insmark = [];

        for (i in values) {
            insmark.push("?");
        }

        var insm = insmark.join(", ")

        var fieldsins = "(" + fields.join(", ") + ", d_date, d_time)";
        var valueins = " values(" + insm + ")";

        var query = "insert into " + table_name + fieldsins + valueins;
       
        this.db.transaction(function (tx) {
            tx.executeSql(query, values)
        }, function(e){console.log(e)});
    },
    
    
    insert_or_update:function(table_name, ufield_name, ufield_id, uiquery){
        var self = this;
        var query = "select * from "+table_name+" where "+ufield_name+" = '"+ufield_id+"'";
        
        self.executesql(query, function(data){
            
            if(data.length){
                self.update(data[0]['id'], table_name, uiquery);
                console.log("update");
            }
            else{
            
                self.create(table_name, uiquery);
                console.log("create");
            }
        })
    },
    
    
    //create row query for table
    createRaw: function (table_name, insert_array) {
        var fields = [];
        var values = [];
        for (key in insert_array) {
            fields.push(key);
            values.push(insert_array[key]);
        }
        var dbdate = new Date();
        var dj = dbdate.toJSON();
        var dl = dj.split("T");
        var date = dl[0];
        var time = dl[1].split(".")[0];

        values.push(date);
        values.push(time);

        var insmark = [];

        for (i in values) {
            insmark.push("?");
        }

        var insm = insmark.join(", ")

        var fieldsins = "(" + fields.join(", ") + ", d_date, d_time)";
        var valueins = " values(" + insm + ")";

        var query = "insert into " + table_name + fieldsins + valueins;
        return [query, values];
        
    },
    
    
    //delete data from table by id
    delete: function (id, table) {
        var query = "delete from " + table + " where id=" + id;
        this.executesql(query);
    },
    //update data in to table
    update: function (id, table, updatedata) {
        var subquery = [];
        for (key in updatedata) {
            var field = key;
            var value = updatedata[key];
            subquery.push(field + " = '" + value + "'");
        }
        subquery = subquery.join(", ");
        var query = "update " + table + " set " + subquery + " where id=" + id;
      
        this.executesql(query);
    }
}

window.session = {
    set: function (name, value, expireminute) {
        var date = new Date();
        var minutes = expireminute ? expireminute : 60;
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        $.cookie(name, value, {expires: date, path: '/'});
    },
    get: function (name) {
        return $.cookie(name, {path: '/'});
    },
    unset: function (name) {
        $.removeCookie(name, {path: '/'});
    }
};


