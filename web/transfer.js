$(function() {
  var conn = null;

  function log(msg) {
    var control = $('#log');
    control.html(control.html() + msg + '<br/>');
    control.scrollTop(control.scrollTop() + 1000);
  }

  function connect() {
    disconnect();
    conn = new SockJS('http://' + window.location.host + '/chat', 'websocket');

    conn.onmessage = function(e) {
      log('Received: ' + e.data);
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

    update_ui();
    return false;
  });
});