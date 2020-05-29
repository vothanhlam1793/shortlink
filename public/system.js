function myFunction(id_input) {
    /* Get the text field */
    var copyText = document.getElementById(id_input);
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
}

var app = new Vue({
    el: '#app',
    data: {
        link:{
            long: "",
            short: ""
        },
        result: "",
        disable_gen: false
    },
    methods:{
        short: function(){
            fetch("/", {
                method: "POST",
                body: JSON.stringify(app.link),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
                console.log(data);
                if(data.data == "OK"){
                    app.result = window.origin + "/" + app.link.short;
                    app.disable_gen = true;
                    app.sync();
                } else if (data.data == "ERROR"){
                    console.log(data.why);
                    alert(data.why);
                } else {
                    console.log("No idea -.-");
                }
            })
        },
        sync: function(){
            fetch("/general", {
                method: "POST",
                body: this.long_link,
                headers: new Headers()
            })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
                console.log(data);
                app.link.short = data.short;
            })
        },
        copy: function(){
            myFunction("result");
        },
        change: function(){
            if(this.disable_gen){
                this.disable_gen = false;
            }
        }
    },
    created:function(){
        this.sync();
    }
})