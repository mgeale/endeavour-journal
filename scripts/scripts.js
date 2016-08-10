Polymer({
    is: "index-elem",
    _on_response: function(r) {
        response = r.detail.response;
//         list = response.querySelectorAll('day'); // for xml version
        list = response;
        console.log(list);

    }
});
