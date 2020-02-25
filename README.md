```
.\node_modules\.bin\webpack --config webpack-default.config.js --mode=development
time: 1.198 s ±  0.012 s
self-reported time: 948ms

.\node_modules\.bin\webpack --config webpack-babel.config.js --mode=development
time: 1.731 s ±  0.011 s s
self-reported time: 1553ms

.\node_modules\.bin\webpack --config webpack-swc.config.js --mode=development
time: 1.195 s ±  0.011 s
self-reported time: 964ms

.\pax-bin\px.exe -i demo.js -E -o dist\demo.js
time: 89.7 ms ±   1.4 ms

.\node_modules\.bin\esbuild demo.js --bundle --outfile=dist\demo.js
time: 136.4 ms ±   1.3 ms

.\node_modules\.bin\webpack --config webpack-default.config.js --mode=production
time: 1.682 s ± 0.009 s
self-reported time: 948ms

.\node_modules\.bin\webpack --config webpack-babel.config.js --mode=production
time: 2.268 s ±  0.012 s
self-reported time: 1553ms

.\node_modules\.bin\webpack --config webpack-swc.config.js --mode=production
time: 1.709 s ±  0.012 s
self-reported time: 964ms

.\pax-bin\px.exe -i demo.js -E -o dist\demo.js
N/A

.\node_modules\.bin\esbuild demo.js --bundle --minify --outfile=dist\demo.js
time: 135.1 ms ±   1.6 ms
```
