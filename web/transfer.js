$(function() {
  var conn = null;

  function log(msg) {
    var control = $('#log');
    control.html(msg );
    control.scrollTop(control.scrollTop() + 1000);
  }

  function images(info){
    var images_info =$("#images_info");
    var s = "<p>";
    s += "Amount of images: " + info.length + "<br />";
    s += "Images:";
    s += "<ul>";
    $.each(info, function(index, value){
        var created = new Date(parseInt(value['Created']) * 1000);
        s += "<li>" + value['RepoTags'] + ", created on: " + created.toLocaleString() + "</li>";
    });
    s += "</ul>";
    s += "</p>";
    images_info.html(s);

    $('#images_log').html(JSON.stringify(info, undefined, 2));
  }

  function containers(info){
    var containers_info =$("#containers_info");
    var s = "<p>";
    s += "Amount of containers: " + info.length + "<br />";
    s += "Containers:";
    s += "<ul>";
    $.each(info, function(index, value){
        var created = new Date(parseInt(value['Created']) * 1000);
        s += "<li>" + value['Names'] + "(" + value['Image'] + "), created on: " + created.toLocaleString() + "</li>";
    });
    s += "</ul>";
    s += "</p>";
    containers_info.html(s);

    $('#containers_log').html(JSON.stringify(info, undefined, 2));
  }

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

  function connect() {
    disconnect();
    conn = new SockJS('http://' + window.location.host + '/chat', 'websocket');

    conn.onmessage = function(e) {
      var obj = $.parseJSON(e.data)
      images(obj['images']);
      containers(obj['containers']);
    };

    conn.onclose = function() {
      conn = null;
      setTimeout('location.reload()', 1000);
    };
  }

  function disconnect() {
    if (conn != null) {
      conn.close();
      conn = null;
    }
  }

  $(document).ready(function() {
    if (conn == null) {
      connect();
    }

    return false;
  });
});