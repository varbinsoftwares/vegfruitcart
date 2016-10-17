projectmodule.factory('GlobleData', function ($q, $http) {
    var GlobleData = {
        user: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            dal.executesql("select au.* from auth_user as au  order by id desc limit 0, 1", function (rdata) {
                if (rdata.length) {
                    deferred.resolve(rdata[0])
                }
                else {
                    deferred.reject()
                }
            })
            return promise;
        },
    };
    return GlobleData;
})

projectmodule.factory('CartOperation', function ($q, $http) {
    var CartOperation = {
        addToCart: function (data) {
            var cdata = angular.copy(data);
            cdata['order_id'] = '';
            dal.create('cart', cdata)
        },
        getCartDetail: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var rdata = {'card_data': [], 'total_price': 0, 'total_quantity': 0};
            dal.executesql("select product_id, title, unit, price, sum(quantity) as quantity, image \n\
                           from cart where order_id = '' group by product_id", function (data) {
                if (data.length) {
                    var qnt = 0;
                    var prc = 0;
                    for (d in data) {
                        var oj = data[d];
                        if (oj.quantity) {
                            qnt = Number(qnt) + Number(oj.quantity);
                            prc = Number(prc) + (Number(oj.quantity) * Number(oj.price))
                        }
                    }
                    var rdata = {'cart_data': data, 'total_price': prc, 'total_quantity': qnt};
                    deferred.resolve(rdata);
                }
                else {
                    deferred.resolve(rdata)
                }
            })
            return promise;
        },
        getOrderDetail: function () {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            dal.executesql("select * from order_data order by order_id desc", function(rdata){
                deferred.resolve(rdata);
            })
            return promise;
        }
    };
    return CartOperation;
})