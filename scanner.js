document.addEventListener('DOMContentLoaded', function() {
    // Configuration for Quagga.js
    var config = {
        inputStream : {
            name : "Live",
            type : "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: 640, // Width of the video stream
                height: 480, // Height of the video stream
                facingMode: "environment" // Use the rear camera (if available)
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        decoder : {
            readers : ["code_128_reader"] // List of barcode formats to decode
        },
        locate: true // try to locate the barcode in the image
    };

    Quagga.init(config, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

    // Draw the scanning area on the video stream
    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                document.getElementById('scanned-barcode').value = result.codeResult.code;
                sendBarcodeToBackend(result.codeResult.code);
            }
        }
    });

    // Function to send barcode to backend
    function sendBarcodeToBackend(code) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "barcode.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
            }
        };
        xhr.send("barcode=" + code);
    }
});
