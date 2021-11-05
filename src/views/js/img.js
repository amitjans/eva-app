socket.on('img', async function ({ url }) {
    $("#imgremote").empty();
    $("#imgremote").append(`<img src="http://127.0.0.1:3000/images/${url}" alt="" height="${window.screen.height}"/>`);
    changeview("imgremote");
});

socket.on('reset', async function () {
    $("#imgremote").empty();
    changeview("vieweyes");
});