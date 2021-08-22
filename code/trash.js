
/**
   * Spatial Frequency Filtering
   * High-pass/Low-pass/Band-pass Filter
   * Windowing using hamming window
   */
 (function() {
    var FrequencyFilter;  // top-level namespace
    var _root = this;     // reference to 'window' or 'global'
  
    if(typeof exports !== 'undefined') {
      FrequencyFilter = exports;   // for CommonJS
    } else {
      FrequencyFilter = _root.FrequencyFilter = {};
    }
  
    // core operations
    var _n = 0;
    var core = {
      init : function(n) {
        if(n !== 0 && (n & (n - 1)) === 0) {
          _n = n;
        } else {
          throw new Error("init: radix-2 required");
        }
      },
      // swaps quadrant
      swap : function(re, im) {
        var xn, yn, i, j, k, l, tmp,
            len = _n >> 1;
        for(var y=0; y<len; y++) {
          yn = y + len;
          for(var x=0; x<len; x++) {
            xn = x + len;
            i = x + y*_n;
            j = xn + yn*_n;
            k = x + yn*_n;
            l = xn + y*_n;
            tmp = re[i];
            re[i] = re[j];
            re[j] = tmp;
            tmp = re[k];
            re[k] = re[l];
            re[l] = tmp;
            tmp = im[i];
            im[i] = im[j];
            im[j] = tmp;
            tmp = im[k];
            im[k] = im[l];
            im[l] = tmp;
          }
        }
      },
      // applies High-Pass Filter
      HPF : function(re, im, radius) {
        var i = 0,
            p = 0,
            r = 0.0,
            n2 = _n >> 1,
            sqrt = Math.sqrt;
        for(var y=-n2; y<n2; y++) {
          i = n2 + (y + n2)*_n;
          for(var x=-n2; x<n2; x++) {
            r = sqrt(x*x + y*y);
            p = x + i;
            if(r < radius) {
              re[p] = im[p] = 0;
            }
          }
        }
      },
      // applies Low-Pass Filter
      LPF : function(re, im, radius) {
        var i = 0,
            p = 0,
            r = 0.0,
            n2 = _n >> 1,
            sqrt = Math.sqrt;
        for(var y=-n2; y<n2; y++) {
          i = n2 + (y + n2)*_n;
          for(var x=-n2; x<n2; x++) {
            r = sqrt(x*x + y*y);
            p = x + i;
            if(r > radius) {
              re[p] = im[p] = 0;
            }
          }
        }
      },
      // applies Band-Pass Filter
      BPF : function(re, im, radius, bandwidth) {
        var i = 0,
            p = 0,
            r = 0.0,
            n2 = _n >> 1,
            sqrt = Math.sqrt;
        for(var y=-n2; y<n2; y++) {
          i = n2 + (y + n2)*_n;
          for(var x=-n2; x<n2; x++) {
            r = sqrt(x*x + y*y);
            p = x + i;
            if(r < radius || r > (radius + bandwidth)) {
              re[p] = im[p] = 0;
            }
          }
        }
      },
      // windowing using hamming window
      windowing : function(data, inv) {
        var len = data.length,
            pi = Math.PI,
            cos = Math.cos;
        for(var i=0; i<len; i++) {
          if(inv === 1) {
            data[i] *= 0.54 - 0.46*cos(2*pi*i/(len - 1));
          } else {
            data[i] /= 0.54 - 0.46*cos(2*pi*i/(len - 1));
          }
        }
      }
    };
    // aliases (public APIs)
    var apis = ['init', 'swap', 'HPF', 'LPF', 'BPF', 'windowing'];
    for(var i=0; i<apis.length; i++) {
      FrequencyFilter[apis[i]] = core[apis[i]];
    }
  }).call(this);
  
  /**
   * FFT Power Spectrum Viewer
   */
  (function() {
    var SpectrumViewer;  // top-level namespace
    var _root = this;    // reference to 'window' or 'global'
  
    if(typeof exports !== 'undefined') {
      SpectrumViewer = exports;   // for CommonJS
    } else {
      SpectrumViewer = _root.SpectrumViewer = {};
    }
  
    // core operations
    var _context = null,
        _n = 0,
        _img = null,
        _data = null;
    var core = {
      init : function(context) {
        _context = context;
        _n = context.canvas.width,
        _img = context.getImageData(0, 0, _n, _n);
        _data = _img.data;
      },
      // renders FFT power spectrum on the canvas
      render : function(re, im, islog) {
        var val = 0,
            i = 0,
            p = 0,
            spectrum = [],
            max = 1.0,
            imax = 0.0,
            n2 = _n*_n,
            log = Math.log,
            sqrt = Math.sqrt;
        for(var i=0; i<n2; i++) {
            if(islog){
            spectrum[i] = log(Math.sqrt(re[i]*re[i] + im[i]*im[i]));
          } else {
            spectrum[i] = sqrt(re[i]*re[i] + im[i]*im[i]);
          }
          if(spectrum[i] > max) {
            max = spectrum[i];
          }
        }
        imax = 1/max;
        for(var j=0; j<n2; j++) {
          spectrum[j] = spectrum[j]*255*imax;
        }
        for(var y=0; y<_n; y++) {
          i = y*_n;
          for(var x=0; x<_n; x++) {
            val = spectrum[i + x];
            p = (i << 2) + (x << 2);
            _data[p] = 0;
            _data[p + 1] = val;
            _data[p + 2] = val >> 1;
          }
        }
        _context.putImageData(_img, 0, 0);
      }
    };
    // aliases (public APIs)
    SpectrumViewer.init = core.init;
    SpectrumViewer.render = core.render;
  }).call(this);
  /*
  .slider::after{
    content: '100';
    color: black;
    font-size: 1rem;
    position: absolute;
    left: 73%;
    top: 143px;
}
.slider::before{
    content: '0';
    color: black;
    font-size: 1rem;
    position: absolute;
    left: 2%;
    top: 143px;
}
*/
