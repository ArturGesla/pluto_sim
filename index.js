var slider=document.getElementById("myRange");
var output=document.getElementById("value");

output.innerHTML=slider.value;

slider.oninput=function(){
    output.innerHTML=this.value; 
}

slider.addEventListener("mousemove",function(){
   var x=slider.value/200*100;
   var color='linear-gradient(90deg, rgb(22, 14, 129)'+x+'%, rgb(214,214,214)'+x+'%)';
    slider.style.background=color;
})



/* *******************************************************************/
// clone from:
// http://rest-term.com/archives/2966/


var spectrum = document.querySelector('#Spectrum').getContext('2d'),
    result = document.querySelector('#Result').getContext('2d'),
    image = new Image();

// Convert http://base64.wutils.com/encoding-online/



image.addEventListener('load', function(e){
    console.log('hey');
    result.drawImage(image,0,0); //somehow explicitly do
    
    var w = image.width,
        h = image.height, // w == h
        re = [],
        im = [];
    // Initialization, the number N is the base number 2
    FFT.init(w);
    FrequencyFilter.init(w);
    
    var src = result.getImageData(0, 0, w, h),
        data = src.data,
        tel_radius = slider.value/2,
        lambda=[665e-9,550e-9,470e-9],
        width=0.12, //deg
        k_max=2*60*60*180*w/width/2, //maximalm wave number k due to sampling
        radius_k=[2*Math.PI/lambda[0]*tel_radius,2*Math.PI/lambda[1]*tel_radius,2*Math.PI/lambda[2]*tel_radius],
        radius_px=[radius_k[0]/k_max*w/2,radius_k[1]/k_max*w/2,radius_k[2]/k_max*w/2],
        i, val, p;
    //console.log(radius_px);
        var _data=[];
    
    for (let index = 0; index < 3; index++) { //loop for three layers
            
        //Generate arrays to store real and imaginary parts
        //Image data is packed into a real array
        for(var y=0; y<h; y++) {
            i = y*w;
            for(var x=0; x<w; x++) {
            re[i + x] = data[(i << 2) + (x << 2)+index]; //only red from rgb, every fouth bit
            im[i + x] = 0.0;
            }
        }
        FFT.fft2d(re, im);  // Secondary meta-FFT
        FrequencyFilter.swap(re, im)  // Quadrant replacement
        FrequencyFilter.LPF(re, im, radius_px[index]);
        FrequencyFilter.swap(re, im);  // 象限入れ替え
        FFT.ifft2d(re, im);  // 二次元逆FFT
    
    
        
        islog=true;
        var val = 0,
            _n=w,
            i = 0,
            p = 0,
            _spectrum = [],
            max = 1.0,
            imax = 0.0,
            n2 = _n*_n;
        /*
        for(var i=0; i<n2; i++) {
        if(islog){
            _spectrum[i] = Math.log(Math.sqrt(re[i]*re[i] + im[i]*im[i]));
    
        } else {
            _spectrum[i] =  Math.sqrt(re[i]*re[i] + im[i]*im[i]);
    
        }
        if(_spectrum[i] > max) {
        max = _spectrum[i];
        }
        }
        imax = 1/max;
        for(var j=0; j<n2; j++) {
            _spectrum[j] = _spectrum[j]*255*imax;
        }
        */
    
    
    
        //var _data=[];
    
        for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x=0; x<_n; x++) {
            //val = _spectrum[i + x];
            val = re[i + x];
            p = (i << 2) + (x << 2);
            _data[p+index] = val;
            //_data[p + 1] = val;//val;
            //_data[p + 2] = val ;
            _data[p + 3] = 255;
        }
        }
    
    }
    //console.log(_data);
    var _img = result.getImageData(0, 0, w, h);
    var data1=Uint8ClampedArray.from(_data);
    
    for (let index = 0; index < w*h*4; index++) {
        _img.data[index]=data1[index];
    }
    
    spectrum.putImageData(_img,0,0);
    })


slider.addEventListener('change', function(e){
    console.log('hey');
    result.drawImage(image,0,0); //somehow explicitly do
    
    var w = image.width,
        h = image.height, // w == h
        re = [],
        im = [];
    // Initialization, the number N is the base number 2
    FFT.init(w);
    FrequencyFilter.init(w);
    
    var src = result.getImageData(0, 0, w, h),
        data = src.data,
        tel_radius = slider.value/2,
        lambda=[665e-9,550e-9,470e-9],
        width=0.12, //deg
        k_max=2*60*60*180*w/width/2, //maximalm wave number k due to sampling
        radius_k=[2*Math.PI/lambda[0]*tel_radius,2*Math.PI/lambda[1]*tel_radius,2*Math.PI/lambda[2]*tel_radius],
        radius_px=[radius_k[0]/k_max*w/2,radius_k[1]/k_max*w/2,radius_k[2]/k_max*w/2],
        i, val, p;
    //console.log(radius_px);
        var _data=[];
    
    for (let index = 0; index < 3; index++) { //loop for three layers
            
        //Generate arrays to store real and imaginary parts
        //Image data is packed into a real array
        for(var y=0; y<h; y++) {
            i = y*w;
            for(var x=0; x<w; x++) {
            re[i + x] = data[(i << 2) + (x << 2)+index]; //only red from rgb, every fouth bit
            im[i + x] = 0.0;
            }
        }
        FFT.fft2d(re, im);  // Secondary meta-FFT
        FrequencyFilter.swap(re, im)  // Quadrant replacement
        FrequencyFilter.LPF(re, im, radius_px[index]);
        FrequencyFilter.swap(re, im);  // 象限入れ替え
        FFT.ifft2d(re, im);  // 二次元逆FFT
    
    
        
        islog=true;
        var val = 0,
            _n=w,
            i = 0,
            p = 0,
            _spectrum = [],
            max = 1.0,
            imax = 0.0,
            n2 = _n*_n;
        /*
        for(var i=0; i<n2; i++) {
        if(islog){
            _spectrum[i] = Math.log(Math.sqrt(re[i]*re[i] + im[i]*im[i]));
    
        } else {
            _spectrum[i] =  Math.sqrt(re[i]*re[i] + im[i]*im[i]);
    
        }
        if(_spectrum[i] > max) {
        max = _spectrum[i];
        }
        }
        imax = 1/max;
        for(var j=0; j<n2; j++) {
            _spectrum[j] = _spectrum[j]*255*imax;
        }
        */
    
    
    
        //var _data=[];
    
        for(var y=0; y<_n; y++) {
        i = y*_n;
        for(var x=0; x<_n; x++) {
            //val = _spectrum[i + x];
            val = re[i + x];
            p = (i << 2) + (x << 2);
            _data[p+index] = val;
            //_data[p + 1] = val;//val;
            //_data[p + 2] = val ;
            _data[p + 3] = 255;
        }
        }
    
    }
    //console.log(_data);
    var _img = result.getImageData(0, 0, w, h);
    var data1=Uint8ClampedArray.from(_data);
    
    for (let index = 0; index < w*h*4; index++) {
        _img.data[index]=data1[index];
    }
    
    spectrum.putImageData(_img,0,0);
    })
image.src = 'pluto2.png';



/*
image.addEventListener('load', function(e) {

var w = image.width,
    h = image.height, // w == h
    re = [],
    im = [];
// Initialization, the number N is the base number 2
FFT.init(w);


//Pass CanvasRenderingCont2D for initialization and display
SpectrumViewer.init(spectrum);
spectrum.drawImage(image, 0,0);
var src = spectrum.getImageData(0, 0, w, h),
    data = src.data,
    radius = 100, //slider.value,
    i, val, p;
//Generate arrays to store real and imaginary parts
//Image data is packed into a real array
for(var y=0; y<h; y++) {
    i = y*w;
    for(var x=0; x<w; x++) {
    re[i + x] = data[(i << 2) + (x << 2)];
    im[i + x] = 0.0;
    }
}
FFT.fft2d(re, im);  // 二次元FFT
FrequencyFilter.swap(re, im)  // 象限入れ替え
//FrequencyFilter.HPF(re, im, radius); // ハイパスフィルタ
//FrequencyFilter.LPF(re, im, radius);  // ローパスフィルタ
//FrequencyFilter.BPF(re, im, radius, radius/2);  // バンドパスフィルタ


SpectrumViewer.render(re, im);  // スペクトル画像を描画
FrequencyFilter.swap(re, im);  // 象限入れ替え
FFT.ifft2d(re, im);  // 二次元逆FFT
// 実数部配列のデータを表示用の CanvasPixelArray に詰める
for(var y=0; y<h; y++) {
    i = y*w;
    for(var x=0; x<w; x++) {
    val = re[i + x];
    p = (i << 2) + (x << 2);
    data[p] = data[p + 1] = data[p + 2] = val;
    }
}
result.putImageData(src, 0, 0);
//
spectrum.drawImage(image, 0,0);
}, false);



*/


