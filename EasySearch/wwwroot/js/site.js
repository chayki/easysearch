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
    //var newFolderTextBox = $('<input>').attr('type', 'text').attr('id', 'txtNewFolder').attr('onkeydown', 'checkAndCreateFolder(event)').addClass('small');
    //newFolderDiv.append(newFolderTextBox);

    $('#txtNewFolder').css('display', 'block');

    $('#createNewFolderAnchor').css('display', 'none');
    $('#foldersDeleteButton').css('display', 'none');
    $('#txtNewFolder').focus();
   


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
                var createNewFolderListItem = $('#createNewFolderAnchor');
                //var imagesDiv = $("#imagesDiv");
                var folderIcon = $('<i>').addClass('fa').addClass('fa-folder-open'); //'< i class="fa fa-folder-open" aria - hidden="true" ></i >';
                var folderAnchor = $('<a>').attr('href', '#').addClass('directory').addClass('list-group-item').append(folderName + "/");
                var checkbox = $('<input>').attr('type', 'radio').addClass('').attr('value', getCurrentFolderPath() + folderName);

                var $tr = $('<div>').addClass('col-md-2').append(folderIcon).append(folderAnchor).insertAfter(newFolderDiv);
                //$("#verticalFoldersDiv").append(folderAnchor).insertBefore(createNewFolderListItem);
                //folderAnchor.insertBefore(createNewFolderListItem);
                var folderItem = $('<div>').addClass("row");
                $('<div>').addClass('col-md-1').append(checkbox).appendTo(folderItem);
                $('<div>').addClass('col-md-10').append(folderAnchor).appendTo(folderItem);
                $("#verticalFoldersDiv").prepend(folderItem);
                createNewFolderListItem.css('display', 'block');
                $('#txtNewFolder').css('display', 'none');
                $('#foldersDeleteButton').css('display', 'block');
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

    if (keyCode === 27) {
        $('#txtNewFolder').css('display', 'none');
        $('#createNewFolderAnchor').css('display', 'block');
        $('#foldersDeleteButton').css('display', 'block');
    }
}

function getCurrentFolderPath() {
    if (typeof Cookies.get('current_folder_path') === 'undefined') {
        setCurrentFolderInCookie('/Home/');
        return "/Home/";
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
            var verticalFoldersDiv = $("#verticalFoldersDiv").empty();
            imagesDiv.empty();
            //var newFolderIcon = $('<i>').addClass('fa-folder-plus').addClass('fas');
            //var newFolderAnchor = $('<a>').attr('href', '#').attr('onclick', 'showNewFolderTextBox(this)').addClass('list-group-item').attr('id', 'createNewFolderAnchor');
            var newFolderTextBox = $('<input>').attr('type', 'text').attr('id', 'txtNewFolder').attr('onkeydown', 'checkAndCreateFolder(event)').addClass('list-group-item').css('display', 'none');
            //newFolderAnchor.append(newFolderIcon);
            verticalFoldersDiv.append(newFolderTextBox);
            //'< i class="fa fa-folder-open" aria - hidden="true" ></i >';
            if (response.folderNames !== null) {
                if (response.folderNames.length > 0) {
                    //$('<h6>').append('Folders').insertBefore(foldersDiv);
                }
                // 

                $.each(response.folderNames, function (i, item) {
                    item = item.replace(getCurrentFolderPath(), '');
                    var folderIcon = $('<i>').addClass('fa').addClass('fa-folder-open');
                    var folderAnchor = $('<a>').attr('href', '#').append(item).addClass('directory').addClass("list-group-item");
                    var checkbox = $('<input>').attr('type', 'radio').addClass('').attr('value', getCurrentFolderPath() + item);
                    var $tr = $('<div>').addClass('col-md-2').append(checkbox).append(folderIcon).append(folderAnchor).insertAfter(newFolderDiv);
                    var folderItem = $('<div>').addClass("row");
                    $('<div>').addClass('col-md-1').append(checkbox).appendTo(folderItem);
                    $('<div>').addClass('col-md-10').append(folderAnchor).appendTo(folderItem);
                    verticalFoldersDiv.append(folderItem);
                   
                });
                //var newFolderIcon = $('<i>').addClass('fa-folder-plus').addClass('fas');
                //var newFolderAnchor = $('<a>').attr('href', '#').attr('onclick', 'showNewFolderTextBox(this)').addClass('list-group-item').attr('id', 'createNewFolderAnchor');
                //var newFolderTextBox = $('<input>').attr('type', 'text').attr('id', 'txtNewFolder').attr('onkeydown', 'checkAndCreateFolder(event)').addClass('list-group-item').css('display', 'none');
                //newFolderAnchor.append(newFolderIcon);
                //verticalFoldersDiv.append(newFolderAnchor).append(newFolderTextBox);
                //$('#verticalFoldersDiv').on('click', 'a', function () {
                //    alert("clicked");
                //});
                $.each(response.files, function (i, item) {
                    var anchor = $('<a>').attr('href', item.path).attr("target", "_blank");
                    var image = $('<img>').attr('src', item.path).css('width', '200px').css('height', '200px').appendTo(anchor); //.addClass('img-thumbnail');
                    var thumbnailDiv = $('<div>').addClass('thumbnail').addClass('card').append(anchor);
                    var checkbox = $('<input>').attr('type', 'checkbox').addClass('d-none').attr('value', item.name);
                    var $tr = $('<div>').addClass('col-md-2').append(checkbox).append(thumbnailDiv).appendTo(imagesDiv);
                });
            }
        },
        failure: function (response) {
            alert(response);
        },
        complete: function () {
            $('#loading').hide();
        }
    });
}

function searchForImagesAndPopulate(folderPath, searchQuery) {
    $("#loading").show();
    $.ajax({
        type: "GET",
        url: "/Search?folderName=" + folderPath + "&searchQuery=" + searchQuery,
        headers: {
            'id_token': getIdTokenFromCookie()
        },
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //var foldersDiv = $("#foldersDiv");
            //var newFolderDiv = $("#newFolderDiv");
            //foldersDiv.empty();
            //foldersDiv.append(newFolderDiv);
            var imagesDiv = $("#imagesDiv");
            imagesDiv.empty();
            //'< i class="fa fa-folder-open" aria - hidden="true" ></i >';
            if (response.files !== null) {
                $.each(response.files, function (i, item) {
                    var anchor = $('<a>').attr('href', item.path).attr("target", "_blank");
                    var image = $('<img>').attr('src', item.path).css('width', '200px').css('height', '200px').appendTo(anchor); //.addClass('img-thumbnail');
                    var thumbnailDiv = $('<div>').addClass('thumbnail').addClass('card').append(anchor);
                    var checkbox = $('<input>').attr('type', 'checkbox').addClass('d-none').attr('value', item.name);
                    var $tr = $('<div>').addClass('col-md-2').append(checkbox).append(thumbnailDiv).appendTo(imagesDiv);
                });
            }
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

        //$('#verticalFoldersDiv').on('click', 'a', function () {
        //    alert("clicked");
        //});
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
    //if (!$("#foldersDeleteButton").hasClass('btn-danger')) {
    //    $("#foldersDiv INPUT[type='checkbox']").removeClass("d-none");
    //    $("#foldersDeleteButton").addClass('btn-danger');
    //    $('#foldersDeleteCancelButton').removeClass('d-none');
    //} else {
        var checkedBoxes = $("#verticalFoldersDiv INPUT[type='radio']").filter(':checked');
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
                    
                    $(item).parent().next().remove();
                    $(item).remove();
                },
                failure: function (response) {
                    alert(response);
                },
                complete: function () {
                    $('#loading').hide();
                }
            });
        });

    //}  
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

$(document.body).on("click", "#btnImageSearch", function () {
    var category = $('#category :selected').val();
    var searchText = "";
    if (category == "") {
        searchText = $('#txtImageSearch').val();
    } else {
        searchText = category + ' ' + $('#txtImageSearch').val();
    }
    var folderPath = getCurrentFolderPath();
    searchForImagesAndPopulate(folderPath, searchText);
    return false;
});

$(document.body).on("click", "#uploadImageButton", function () {
    var url = $("#imageUrlInput").val();
    var targetPath = getCurrentFolderPath();
    if (url === "" || !checkUrl(url)) {
        alert("please enter a valid url");
        return false;
    }

    $('#imgPreview').attr('src', url);
    getImageLabels("", url);
    //$('#imageContent').val(reader.result);

    //$("#loading").show();
    //$.ajax({
    //    type: "GET",
    //    url: "/UploadImage?targetPath=" + targetPath + "&url=" + url,
    //    headers: {
    //        'id_token': getIdTokenFromCookie()
    //    },
    //    contentType: "application/json",
    //    dataType: "json",
    //    success: function (response) {
    //        getDirectoryItemsAndPopulate(targetPath);
    //        $("#imageUrlInput").val("");
    //        alert("upload successful");
    //    },
    //    failure: function (response) {
    //        alert("upload failed");
    //    },
    //    complete: function () {
    //        $('#loading').hide();
    //    }
    //});
});

function uploadImageFromUrl(targetPath, url, imageLabels) {
    $("#loading").show();
    $.ajax({
        type: "GET",
        url: "/UploadImage?targetPath=" + targetPath + "&url=" + url + "&labels=" + encodeURIComponent(imageLabels),
        headers: {
            'id_token': getIdTokenFromCookie()
        },
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            getDirectoryItemsAndPopulate(targetPath);
            $("#imageUrlInput").val("");
            alert("upload successful");
            $('#exampleModal').modal('hide');
        },
        failure: function (response) {
            alert("upload failed");
        },
        complete: function () {
            $('#loading').hide();
        }
    });
}

function uploadImageFile(targetPath, imageContent, imageLabels) {
    $("#loading").show();
    var postData = { "imageContent": imageContent, "targetPath": targetPath, "labels": imageLabels};
    $.ajax({
        type: "POST",
        url: "/UploadImageFile",
        headers: {
            'id_token': getIdTokenFromCookie()
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(postData),
        success: function (response) {
            getDirectoryItemsAndPopulate(targetPath);
            $("#imageUrlInput").val("");
            alert("upload successful");
            $('#exampleModal').modal('hide');
        },
        failure: function (response) {
            alert("upload failed");
        },
        complete: function () {
            $('#loading').hide();
        }
    });
}

function getImageLabels(imageContent, imageUrl) {
    $("#loading").show();
    var postData = { "imageContent": imageContent, "imageUrl": imageUrl };
    $.ajax({
        type: "POST",
        url: "/GetImageLabels",
        headers: {
            'id_token': getIdTokenFromCookie()
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(postData),
        success: function (response) {
            debugger;
            $('#imageLabels').text(response.join());
            $('#exampleModal').modal('show');
                    },
        failure: function (response) {
            alert("label extraction failed failed");
        },
        complete: function () {
            $('#loading').hide();
        }
    });
}


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

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        //reader.onload = function (e) {
        //    $('#imgPreview').attr('src', e.target.result);
        //}
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            $('#imgPreview').attr('src', e.target.result);
            //uploadImageFile(getCurrentFolderPath(), reader.result);
            //debugger;
            getImageLabels(reader.result, "");
            $('#imageContent').val(reader.result);
            
        };
    }
}

$("#btnSubmitModal").click(function () {
    var imageContent = $("#imageContent").val();
    var imageLabels = $("#imageLabels").text();
    var userLabels = $("#userLabels").val();
    var imageUrl = $("#imageUrlInput").val();
    finalLabels = imageLabels + "," + userLabels;
    arrFinalLabels = finalLabels.split(',');
    debugger;
    if (imageContent !== "") {
        uploadImageFile(getCurrentFolderPath(), imageContent, arrFinalLabels);
    } else if (imageUrl !== "") {
        uploadImageFromUrl(getCurrentFolderPath(), imageUrl, arrFinalLabels);
    }
    $("#userLabels").val('');
    });

