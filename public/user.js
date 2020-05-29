
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        user: {
            name: "",
            classId: "",
            username: "",
            password: ""
        },
        groups: new GroupList()
    },
    methods:{
        create: function(){
            var u = new User(this.user);
            u.save();
            alert("Đã tạo tài khoản thành công");
        }
    }
})