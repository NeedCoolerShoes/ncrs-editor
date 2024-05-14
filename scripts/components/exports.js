import * as jszip from 'jszip'; /* future implementation of 3d files */

// https://stackoverflow.com/questions/25547475/save-to-local-file-from-blob
const downloadFile = (blob, fileName) => {
    const link = document.createElement('a');
    // create a blobURI pointing to our Blob
    link.href = blob;
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

document.getElementById('exportPng').addEventListener("click", function () {
    downloadFile(localStorage.getItem('skinRef'), "skin.png")
    /* future 3d .blend file implementation
    var zip = new jszip();
    as.pipe(zip.file("3d_model.blend"))
    zip.file("Hello.txt", "Hello World\n");
    var img = zip.folder("images");
    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            // see FileSaver.js
            downloadFile(URL.createObjectURL(content), "example.zip");
        });
    */
});

