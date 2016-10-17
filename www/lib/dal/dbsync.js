function setDataSupport(ptd) {
    var ptd = ptd;
    var postDict = ptd;
    for (imgi in ptd.images) {
        var imgd = {
            'post_id': ptd.post_id,
            'image': ptd.images[imgi]
        };
        dal.create('post_images', imgd);
    }

    for (ili in ptd.like) {
        var liked = ptd.like[ili];
        dal.create('post_like', liked);
    }

    for (icm in ptd.comment) {
        var comment = ptd.comment[icm];
        dal.create('post_comment', comment);
    }
    delete postDict['images'];
    delete postDict['like'];
    delete postDict['comment'];

    dal.create('post', postDict);
}



function syncFromServer() {
    var selfd = this;
    dal.executesql("select * from school_registration order by id desc limit 0, 1", function (rdata) {
        if (rdata.length) {
            var schooldata = rdata[0];
          
            dal.executesql("select post_id from post order by post_id desc limit 0, 1", function (res) {
                if (res.length) {
                    var lastid = res[0]['post_id'];
                    var schoolid = schooldata.school_id;
                    console.log(schoolid);
                }
                else {
                    var lastid = 0;
                    var schoolid = schooldata.school_id;;
                }
                var url = serverurl + 'api/postlist'
                $.get(url, {'last_id': lastid, 'school_id': schoolid}, function (response) {
                    var data = JSON.parse(response);
                    for (i in data) {
                        setDataSupport(data[i]);
                    }
                })
            });
        }
    });
    dal.executesql("select * from gcm_registration order by id desc limit 0, 1", function (res) {
        //  alert(res);
        if (res.length) {
            var userid = res[0]['user_id'];
            // alert(userid);
            if (userid) {
            }
            else {
                dal.executesql("select user_id from auth_user order by id desc limit 0, 1", function (udata) {
                    if (udata.length) {
                        var url = serverurl + 'api/gcmvarification'
                        $.get(url, {user_id: udata[0]['user_id'], 'server_id': res[0]['server_id']}, function (response) {
                            var data = JSON.parse(response);
                            var updatedict = {'user_id': data['user_id']};
                            dal.update(res[0]['id'], 'gcm_registration', updatedict);
                            alert("Device Varified");
                        })
                    }
                })
            }
        }
    });
}
















document.addEventListener("online", onOnline, false);
function onOnline() {
    setInterval(function () {
        syncFromServer();
    }, 10000);
}



setInterval(function () {
    syncFromServer();
}, 10000);





