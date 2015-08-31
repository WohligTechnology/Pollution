var uploadres = [];
var selectedData = [];
var abc = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
window.uploadUrl = 'http://104.197.23.70/user/uploadfile';
//window.uploadUrl = 'http://192.168.2.22:1337/user/uploadfile';
//window.uploadUrl = 'http://localhost:1337/user/uploadfile';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 1;
    $scope.navigation = NavigationService.getnav();
    //  NavigationService.countUser(function(data, status) {
    //    $scope.user = data;
    //  });
});
phonecatControllers.controller('login', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;

    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.login = {};
    $scope.verifylogin = function() {
        console.log($scope.login);
        if ($scope.login.email && $scope.login.password) {
            NavigationService.adminLogin($scope.login, function(data, status) {
                if (data.value == "false") {
                    $scope.isValidLogin = 0;
                } else {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", data);
                    $location.url("/home");
                }
            })
        } else {
            console.log("blank login");
            $scope.isValidLogin = 0;
        }

    }
});
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService) {
    $scope.template = TemplateService;
    //  if (!$.jStorage.get("adminuser")) {
    //    $location.url("/login");
    //
    //  }
});

phonecatControllers.controller('createorder', function($scope, TemplateService, NavigationService, ngDialog, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Orders");
    TemplateService.title = $scope.menutitle;
    TemplateService.list = 2;
    TemplateService.content = "views/createorder.html";
    $scope.navigation = NavigationService.getnav();
    console.log($routeParams.id);

    $scope.order = {};

    $scope.submitForm = function() {
        console.log($scope.order);
        NavigationService.saveOrder($scope.order, function(data, status) {
            console.log(data);
            $location.url("/order");
        });
    };


    $scope.order.tag = [];
    $scope.ismatch = function(data, select) {
        abc.select = select;
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.order.tag = select.selected;
            }
        });
        console.log($scope.artwork.tag);
    }


    $scope.refreshOrder = function(search) {
        $scope.tag = [];
        if (search) {
            NavigationService.findArtMedium(search, $scope.order.tag, function(data, status) {
                $scope.tag = data;
            });
        }
    };

    $scope.GalleryStructure = [{
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }, {
        "name": "image",
        "type": "image"
    }, {
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }];

    $scope.persons = [{
        "id": 1,
        "name": "first option"
    }, {
        "id": 2,
        "name": "first option"
    }, {
        "id": 3,
        "name": "first option"
    }, {
        "id": 4,
        "name": "first option"
    }, {
        "id": 5,
        "name": "first option"
    }];

    NavigationService.getUser(function(data, status) {
        $scope.persons = data;
    });

});




phonecatControllers.controller('UserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/User.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.User = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedUser($scope.pagedata, function(data, status) {
            $scope.user = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteUser(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
        $.jStorage.set('deleteuser', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'UserCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createuser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    $scope.submitForm = function() {
        NavigationService.saveUser($scope.user, function(data, status) {
            $location.url('/user');
        });
    };
    $scope.user.gallery = [];
    $scope.GalleryStructure = [{
        "name": "Id",
        "type": "text"
    }, {
        "name": "FinalImage",
        "type": "text"
    }, {
        "name": "FacebookPostid",
        "type": "text"
    }, {
        "name": "TwitterPostid",
        "type": "text"
    }];
    $scope.user.dailypost = [];
    $scope.DailyPostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
    $scope.user.post = [];
    $scope.PostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
});
phonecatControllers.controller('editUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edituser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    NavigationService.getOneUser($routeParams.id, function(data, status) {
        $scope.user = data;
        if (!$scope.user.gallery) {
            $scope.user.gallery = [];
        }
        if (!$scope.user.dailypost) {
            $scope.user.dailypost = [];
        }
        if (!$scope.user.post) {
            $scope.user.post = [];
        }
    });
    $scope.submitForm = function() {
        $scope.user._id = $routeParams.id;
        NavigationService.saveUser($scope.user, function(data, status) {
            $location.url('/user');
        });
    };
    $scope.GalleryStructure = [{
        "name": "Id",
        "type": "text"
    }, {
        "name": "FinalImage",
        "type": "text"
    }, {
        "name": "FacebookPostid",
        "type": "text"
    }, {
        "name": "TwitterPostid",
        "type": "text"
    }];
    $scope.DailyPostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
    $scope.PostStructure = [{
        "name": "PostId",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }, {
        "name": "Likes",
        "type": "text"
    }, {
        "name": "Shares",
        "type": "text"
    }, {
        "name": "Retweets",
        "type": "text"
    }, {
        "name": "Favourites",
        "type": "text"
    }, {
        "name": "Total",
        "type": "text"
    }, {
        "name": "CreationDate",
        "type": "text"
    }];
});
phonecatControllers.controller('ImagesCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Images');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/Images.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Images = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedImages($scope.pagedata, function(data, status) {
            $scope.images = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteImages(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
        $.jStorage.set('deleteimages', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'ImagesCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createImagesCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Images');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createimages.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.images = {};
    $scope.submitForm = function() {
        NavigationService.saveImages($scope.images, function(data, status) {
            $location.url('/images');
        });
    };
});
phonecatControllers.controller('editImagesCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Images');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editimages.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.images = {};
    NavigationService.getOneImages($routeParams.id, function(data, status) {
        $scope.images = data;
    });
    $scope.submitForm = function() {
        $scope.images._id = $routeParams.id;
        NavigationService.saveImages($scope.images, function(data, status) {
            $location.url('/images');
        });
    };
});
phonecatControllers.controller('ImageTypeCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('ImageType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/ImageType.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.ImageType = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedImageType($scope.pagedata, function(data, status) {
            $scope.imagetype = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteImageType(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
        $.jStorage.set('deleteimagetype', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'ImageTypeCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createImageTypeCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('ImageType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createimagetype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.imagetype = {};
    $scope.submitForm = function() {
        NavigationService.saveImageType($scope.imagetype, function(data, status) {
            $location.url('/imagetype');
        });
    };
});
phonecatControllers.controller('editImageTypeCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('ImageType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editimagetype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.imagetype = {};
    NavigationService.getOneImageType($routeParams.id, function(data, status) {
        $scope.imagetype = data;
    });
    $scope.submitForm = function() {
        $scope.imagetype._id = $routeParams.id;
        NavigationService.saveImageType($scope.imagetype, function(data, status) {
            $location.url('/imagetype');
        });
    };
});
phonecatControllers.controller('ResultCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Result');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/Result.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Result = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedResult($scope.pagedata, function(data, status) {
            $scope.result = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteResult(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
        $.jStorage.set('deleteresult', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'ResultCtrl',
            closeByDocument: false
        });
    }
});
phonecatControllers.controller('createResultCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Result');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createresult.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.result = {};
    $scope.submitForm = function() {
        NavigationService.saveResult($scope.result, function(data, status) {
            $location.url('/result');
        });
    };
    $scope.result.standings = [];
    $scope.StandingsStructure = [{
        "name": "UserId",
        "type": "text"
    }, {
        "name": "Rank",
        "type": "text"
    }, {
        "name": "Points",
        "type": "text"
    }];
});
phonecatControllers.controller('editResultCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Result');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editresult.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.result = {};
    NavigationService.getOneResult($routeParams.id, function(data, status) {
        $scope.result = data;
        if (!$scope.result.standings) {
            $scope.result.standings = [];
        }
    });
    $scope.submitForm = function() {
        $scope.result._id = $routeParams.id;
        NavigationService.saveResult($scope.result, function(data, status) {
            $location.url('/result');
        });
    };
    $scope.StandingsStructure = [{
        "name": "UserId",
        "type": "text"
    }, {
        "name": "Rank",
        "type": "text"
    }, {
        "name": "Points",
        "type": "text"
    }];
}); //Add New Controller