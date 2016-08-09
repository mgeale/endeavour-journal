Polymer({
    is: "test-elem",
    _on_response: function(r) {
        response = r.detail.response;
        // list = response.querySelectorAll('day');
        list = response;
        console.log(list);

    }
});
