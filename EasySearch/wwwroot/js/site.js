// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function showNewFolderTextBox(e) {
    //$('#liTxtNewFolder').removeClass('d-none');
    //$('#txtNewFolder').val('');
    //$('#txtNewFolder').focus();
    //$(e).addClass('d-none');
    
    //$('#iconCloseNewFolder').removeClass('d-none');

    var newFolderDiv = $('#newFolderDiv');
    newFolderDiv.empty();
    var newFolderTextBox = $('<input>').attr('type', 'text').attr('id', 'txtNewFolder').attr('onkeydown', 'checkAndCreateFolder(event)').addClass('small');
    newFolderDiv.append(newFolderTextBox);
}

function hideNewFolderTextBox(e) {
    $('#liTxtNewFolder').addClass('d-none');
    $(e).addClass('d-none');
    $('#iconCreateNewFolder').removeClass('d-none');
}

function checkAndCreateFolder(e) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    var folderName = $('#txtNewFolder').val();
    if (keyCode === 13) {
        if (folderName !== "") {
            $("<li class=\"breadcrumb-item\"><a href=\"#\">" + folderName + "/"+"</a></li>").insertBefore("#liTxtNewFolder");
        }
        $('#loading').show();
        $.ajax({
            type: "GET",
            url: "/CreateFolder?folderName=" + getCurrentFolderPath() + folderName,
            headers: {
                'id_token': getIdTokenFromCookie()
            },
            contentType: "application/json",
            dataType: "json",
            success: function (response) {

                var foldersDiv = $("#foldersDiv");
                var newFolderDiv = $("#newFolderDiv");
                //var imagesDiv = $("#imagesDiv");
                var folderIcon = $('<i>').addClass('fa').addClass('fa-folder-open'); //'< i class="fa fa-folder-open" aria - hidden="true" ></i >';
                var folderAnchor = $('<a>').attr('href', '#').addClass('directory').append(folderName + "/");
                var $tr = $('<div>').addClass('col-md-2').append(folderIcon).append(folderAnchor).insertAfter(newFolderDiv);
                //if (response.folderNames.length > 0) {
                //    //$('<h6>').append('Folders').insertBefore(foldersDiv);
                //}

                //$.each(response.folderNames, function (i, item) {
                    
                //});
                //$.each(response.imageUrls, function (i, item) {
                //    var image = $('<img>').attr('src', item).css('width', '200px').css('height', '200px'); //.addClass('img-thumbnail');
                //    var thumbnailDiv = $('<div>').addClass('thumbnail').append(image);
                //    var $tr = $('<div>').addClass('col-md-4').append(thumbnailDiv).appendTo(imagesDiv);
                //});
            },
            failure: function (response) {
                alert(response);
            },
            complete: function () {
                $('#loading').hide();
            }
        });
        var newFolderDiv = $('#newFolderDiv');
        newFolderDiv.empty();
        var newFolderAnchor = $('<a>').attr('href', '#').attr('onclick', 'showNewFolderTextBox(this)');
        $('<i>').addClass('fa-folder-plus').addClass('fas').appendTo(newFolderAnchor);
        newFolderAnchor.appendTo(newFolderDiv);

        $('#liTxtNewFolder').addClass('d-none');
        $('#iconCloseNewFolder').addClass('d-none');
        $('#iconCreateNewFolder').removeClass('d-none');
        return false;
    }
}

function getCurrentFolderPath() {
    if (typeof Cookies.get('current_folder_path') === 'undefined') {
        setCurrentFolderInCookie('/test12/');
        return "/test12/";
    } else {
        return Cookies.get('current_folder_path');
    }
}

function setCurrentFolderInCookie(currentFolder) {
    Cookies.set('current_folder_path', currentFolder);
}

function setIdTokenInCookie(idToken) {
    Cookies.set('id_token', idToken);
}

function getIdTokenFromCookie() {
    return Cookies.get('id_token');
}

function getDirectoryItemsAndPopulate(currentFolderPath) {
    $("#loading").show();
    $.ajax({
        type: "GET",
        url: "/GetDirectoryItems?folderName=" + currentFolderPath,
        headers: {
            'id_token': getIdTokenFromCookie()
        },
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var foldersDiv = $("#foldersDiv");
            var newFolderDiv = $("#newFolderDiv");
            foldersDiv.empty();
            foldersDiv.append(newFolderDiv);
            var imagesDiv = $("#imagesDiv");
            imagesDiv.empty();
             //'< i class="fa fa-folder-open" aria - hidden="true" ></i >';
            if (response.folderNames.length > 0) {
                //$('<h6>').append('Folders').insertBefore(foldersDiv);
            }

            $.each(response.folderNames, function (i, item) {
                var folderIcon = $('<i>').addClass('fa').addClass('fa-folder-open');
                var folderAnchor = $('<a>').attr('href', '#').append(item).addClass('directory');
                var checkbox = $('<input>').attr('type', 'checkbox').addClass('d-none').attr('value', getCurrentFolderPath() + item);
                var $tr = $('<div>').addClass('col-md-2').append(checkbox).append(folderIcon).append(folderAnchor).insertAfter(newFolderDiv);
            });
            $.each(response.files, function (i, item) {
                var image = $('<img>').attr('src', item.path).css('width', '200px').css('height', '200px'); //.addClass('img-thumbnail');
                var thumbnailDiv = $('<div>').addClass('thumbnail').addClass('card').append(image);
                var checkbox = $('<input>').attr('type', 'checkbox').addClass('d-none').attr('value', item.name);
                var $tr = $('<div>').addClass('col-md-2').append(checkbox).append(thumbnailDiv).appendTo(imagesDiv);
            });
        },
        failure: function (response) {
            alert(response);
        },
        complete: function () {
            $('#loading').hide();
        }
    });
}

function regenerateBreadcrumb(currentFolderPath) {
    var breadcrumbOl = $('#folderTreeBreadCrumb');
    breadcrumbOl.empty();
    //var bcItem = $('<li>').addClass('breadcrumb-item');
    //$('<a>').attr('href', '#').append('test').appendTo(bcItem);
    var folderNames = currentFolderPath.split('/').filter(Boolean);
    //breadcrumbOl.append(bcItem);
    $.each(folderNames, function (index, value) {
        var bcItem = $('<li>').addClass('breadcrumb-item');
        $('<a>').attr('href', '#').append(value).appendTo(bcItem);
        breadcrumbOl.append(bcItem);
    });
}

$(document).ready(function () {
    if (getIdTokenFromCookie() !== "" ) {
        getDirectoryItemsAndPopulate(getCurrentFolderPath());
        regenerateBreadcrumb(getCurrentFolderPath());
        $(document.body).on("click", ".directory", function (e) {
            var currFolderPath = getCurrentFolderPath();
            var newFolderPath = currFolderPath + $(this).text();
            setCurrentFolderInCookie(newFolderPath);
            getDirectoryItemsAndPopulate(newFolderPath);
            regenerateBreadcrumb(newFolderPath);
        });
    }
});


$(document.body).on("click", ".breadcrumb-item", function () {
    $(this).nextAll().remove();
    var li = $("#folderTreeBreadCrumb").find('li');
    var folderPath = "/";
    li.each(function () {
        folderPath = folderPath + $(this).text() +"/";
    });
    setCurrentFolderInCookie(folderPath);
    getDirectoryItemsAndPopulate(folderPath);
    regenerateBreadcrumb(folderPath);

    //$('#iconCloseNewFolder').addClass('d-none');
    //$('#iconCreateNewFolder').removeClass('d-none');
});

$(document.body).on("click", "#foldersDeleteButton", function () {
    if (!$("#foldersDeleteButton").hasClass('btn-danger')) {
        $("#foldersDiv INPUT[type='checkbox']").removeClass("d-none");
        $("#foldersDeleteButton").addClass('btn-danger');
        $('#foldersDeleteCancelButton').removeClass('d-none');
    } else {
        var checkedBoxes = $("#foldersDiv INPUT[type='checkbox']").filter(':checked');
        if (checkedBoxes.length < 1) {
            alert('please select atleast one folder to delete');
            return false;
        }

        $('#loading').show();
        $.each(checkedBoxes, function (index, item) {
            $.ajax({
                type: "GET",
                url: "/DeleteFolder?folderPath=" + item.value,
                headers: {
                    'id_token': getIdTokenFromCookie()
                },
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    $(item).parent().remove();
                },
                failure: function (response) {
                    alert(response);
                },
                complete: function () {
                    $('#loading').hide();
                }
            });
        });

    }  
});

$(document.body).on("click", "#imagesDeleteButton", function () {
    if (!$("#imagesDeleteButton").hasClass('btn-danger')) {
        $("#imagesDiv INPUT[type='checkbox']").removeClass("d-none");
        $("#imagesDeleteButton").addClass('btn-danger');
        $('#imagesDeleteCancelButton').removeClass('d-none');
    } else {
        if ($("#imagesDiv INPUT[type='checkbox']").filter(':checked').length < 1) {
            alert('please select atleast one image to delete');
        }
        var checkedBoxes = $("#imagesDiv INPUT[type='checkbox']").filter(':checked');
        if (checkedBoxes.length < 1) {
            alert('please select atleast one image to delete');
            return false;
        };
        $('#loading').show();
        $.each(checkedBoxes, function (index, item) {
            $.ajax({
                type: "GET",
                url: "/DeleteImage?imageAbsolutePath=" + item.value,
                headers: {
                    'id_token': getIdTokenFromCookie()
                },
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    $(item).parent().remove();
                },
                failure: function (response) {
                    alert(response);
                },
                complete: function () {
                    $('#loading').hide();
                }
            });
        });
    }
});

$(document.body).on("click", "#imagesDeleteCancelButton", function () {
    $("#imagesDiv INPUT[type='checkbox']").addClass("d-none");
    $("#imagesDeleteButton").removeClass('btn-danger');
    $('#imagesDeleteCancelButton').addClass('d-none');
});

$(document.body).on("click", "#uploadImageButton", function () {
    var url = $("#imageUrlInput").val();
    var targetPath = getCurrentFolderPath();
    if (url === "" || !checkUrl(url)) {
        alert("please enter a valid url");
        return false;
    }

    $("#loading").show();
    $.ajax({
        type: "GET",
        url: "/UploadImage?targetPath=" + targetPath + "&url=" + url,
        headers: {
            'id_token': getIdTokenFromCookie()
        },
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            getDirectoryItemsAndPopulate(targetPath);
            $("#imageUrlInput").val("");
            alert("upload successful");
        },
        failure: function (response) {
            alert("upload failed");
        },
        complete: function () {
            $('#loading').hide();
        }
    });
});

function checkUrl(url) {
    //regular expression for URL
    var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;

    if (pattern.test(url)) {
        return true;
    } else {
        return false;
    }
}


$(document.body).on("click", "#foldersDeleteCancelButton", function () {
        $("#foldersDiv INPUT[type='checkbox']").addClass("d-none");
        $("#foldersDeleteButton").removeClass('btn-danger');
        $('#foldersDeleteCancelButton').addClass('d-none');
    });

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    
    setIdTokenInCookie(id_token);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    console.log('Id_token' + id_token);
    window.location.href = "/Home";
}


function signOut() {
    
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    setIdTokenInCookie("");
    
    window.location.href = '/';
}


